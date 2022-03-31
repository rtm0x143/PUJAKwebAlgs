#include "../LearningClientV.h"
#include "../../algs/NeuralNetworkV.h"
#include <fstream>

template <class NeuralNetwork, typename BackpropResult>
LearningClientV<NeuralNetwork, BackpropResult>::LearningClientV(NeuralNetwork& net, size_t workersCount) : 
	dataset(nullptr), 
	resultSum(nullptr),
	workers(workersCount), 
	regions(workersCount),
	isWorkerDone(workersCount, false),
	terminateFlag(false),
	_tasksDone(0)
{
	for (size_t i = 0; i < workersCount; ++i) {
		workers[i] = new std::thread(workerRuntime, this, std::ref(regions[i]), std::ref(net), 
			std::function<void()>([i, client = this]() {
				client->isWorkerDone[i] = true;
				if (client->isDone()) 
					client->workDone.notify_one();
			}));	
	}
}

template <class NeuralNetwork, typename BackpropResult>
void LearningClientV<NeuralNetwork, BackpropResult>::launch(Dataset* dataset)
{
	this->dataset = dataset;
	_tasksDone = 0;
	delete resultSum;
	resultSum = nullptr;

	size_t regionSize = dataset->size() / workers.size(),
		remnants = dataset->size() % workers.size();

	regions[0].first = dataset->begin();
	regions[0].second = dataset->begin() + regionSize;
	for (size_t i = 1; i < workers.size(); ++i)
	{
		regions[i].first = regions[i - 1].second;
		regions[i].second = regions[i].first + regionSize;
		if (remnants) {
			++regions[i].second;
			--remnants;
		}
	}

	isWorkerDone.assign(workers.size(), false);
	awakeWorkers.notify_all();
}

//template <class NeuralNetwork, typename BackpropResult>
//bool LearningClientV<NeuralNetwork, BackpropResult>::_isDone(std::unique_lock<std::mutex>& isDoneLock) 
//{
//	for (bool flag : isWorkerDone) {
//		if (!flag) return false;
//	}
//	return true;
//}

template <class NeuralNetwork, typename BackpropResult>
bool LearningClientV<NeuralNetwork, BackpropResult>::isDone() 
{
	std::unique_lock<std::mutex> lock(isDoneMutex);
	for (bool flag : isWorkerDone) {
		if (!flag) return false;
	}
	return true;
}

template <class NeuralNetwork, typename BackpropResult>
void LearningClientV<NeuralNetwork, BackpropResult>::await() 
{
	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);
	if (isDone()) return;
	workDone.wait(selfLock);
	dataset = nullptr;
}

template <class NeuralNetwork, typename BackpropResult>
BackpropResult* LearningClientV<NeuralNetwork, BackpropResult>::getResult()
{
	await();
	return resultSum;
}

template <class NeuralNetwork, typename BackpropResult>
size_t LearningClientV<NeuralNetwork, BackpropResult>::tasksDone()
{
	std::unique_lock<std::mutex> lock(outputMutex);
	return _tasksDone;
}

template <class NeuralNetwork, typename BackpropResult>
void LearningClientV<NeuralNetwork, BackpropResult>::workerRuntime(
	LearningClientV* client, Region& region, NeuralNetwork& net, std::function<void()> finishCallback)
{
	NeuralNetwork _net(net);
	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);
	while (!client->terminateFlag)
	{
		while (!client->dataset) {
			client->awakeWorkers.wait(selfLock);
			if (client->terminateFlag) return;
		}

		for (; region.first < region.second && !client->terminateFlag; ++region.first)
		{
			DataSetPackage& package = *region.first;
			BackpropResult* result = _net.train(package.data, package.label);
			{
				std::unique_lock<std::mutex> selfLock(client->outputMutex);
				if (client->resultSum) {
					*client->resultSum += *result;
				}
				else {
					client->resultSum = result;
					result = nullptr;
				}
				++client->_tasksDone;
			}
			delete result;
		}
		finishCallback();
	}
}



uint8_t buf4[4];

int readBegInt32(std::ifstream& stream) {
	for (int i = 3; i >= 0; --i)
		stream >> buf4[i];
	return *(int*)&buf4;
}

void normalize_MultiThread(std::vector<uint8_t>& buffer, size_t imgSize,
	Dataset& output, size_t workersCount)
{
	std::thread* workers = new std::thread[workersCount];

	auto runtime = [&output, imgSize, &buffer](size_t imgInd, size_t endInd) {
		uint8_t* byteRegion = buffer.data() + imgInd * imgSize;
		for (; imgInd < endInd; ++imgInd) {
			std::vector<double>& cur = output[imgInd].data;
			cur = std::vector<double>(imgSize);

			for (size_t i = 0; i < imgSize; ++i) {
				cur[i] = (double)*(byteRegion++) / 255;
			}
		}
	};

	size_t regionSize = output.size() / workersCount,
		remnants = output.size() % workersCount;

	size_t ind1, ind2 = 0;
	for (size_t i = 0; i < workersCount; ++i)
	{
		ind1 = ind2;
		ind2 += regionSize;
		if (remnants) { ++ind2; --remnants; }
		workers[i] = std::thread(runtime, ind1, ind2);
	}

	for (size_t i = 0; i < workersCount; ++i) {
		workers[i].join();
	}
	delete[] workers;
}


template <class NeuralNetwork, typename BackpropResult> 
Dataset LearningClientV<NeuralNetwork, BackpropResult>::download_MNIST_Dataset_MultiThread(
	const std::string& pathToImg, const std::string& pathTolabel, size_t workersCount)
{
	std::ifstream istream(pathToImg, std::ios::in | std::ios::binary);
	std::ifstream lstream(pathTolabel, std::ios::in | std::ios::binary);

	// skip useless data
	{
		istream.read((char*)buf4, 4);
		lstream.read((char*)buf4, 4);
		lstream.read((char*)buf4, 4);
	}

	int datasetSize = readBegInt32(istream),
		row = readBegInt32(istream), col = readBegInt32(istream),
		imgSize = row * col;

	Dataset dataset(datasetSize);
	std::vector<uint8_t> buffer(imgSize * datasetSize);

	istream.read((char*)buffer.data(), buffer.size());
	normalize_MultiThread(buffer, imgSize, dataset, workersCount);

	for (size_t i = 0; i < datasetSize; ++i)
	{
		lstream >> dataset[i].label;
	}
	return dataset;
}

template class LearningClientV<NeuralNetworkV, NeuralNetworkV::BackpropResult>;