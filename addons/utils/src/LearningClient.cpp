#include <algorithm>
#include "../LearningClient.h"
#include "../tools.h"

using namespace vectorExtention;

LearningClient::LearningClient(MNIST_DSStream* stream, const NeuralNetwork& net, size_t workersCount)
	: _stream(stream), workers(workersCount), resultSum(true),
	tasksDone(0), sampleSize(0), layCount(net.dims.size()), run(true)
{
	resultSum.weightsGradient = new Matrix<double>[layCount - 1];
	resultSum.biasesGradient = new std::vector<double>[layCount];
	for (size_t i = 1; i < layCount; ++i) {
		resultSum.weightsGradient[i - 1] = Matrix<double>(net.dims[i], net.dims[i - 1], 0);
		resultSum.biasesGradient->assign(net.dims[i], 0);
	}
	for (std::thread* thr : workers) {
		thr = new std::thread(workerRuntime, this, net);
	}
}

LearningClient::~LearningClient() {
	run = false;
	awakeWorkers.notify_all();
	for (std::thread* pthr : workers) {
		if (pthr) if (pthr->joinable()) pthr->join();
		delete pthr;
	}
}

void LearningClient::workerRuntime(LearningClient* client, const NeuralNetwork& net) 
{
	NeuralNetwork _net(net);
	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);

	while (client->run)
	{
		while (client->tasksDone >= client->sampleSize) {
			client->workDone.notify_one();
			client->awakeWorkers.wait(selfLock);
			if (!client->run) return;
		}
		MNIST_DSStream::Package* package;
		{
			std::unique_lock<std::mutex> lock(client->streamMutex);
			if (client->_stream->isEnded()) continue;
			package = client->_stream->nextPackage();
		}
		auto result = _net.backPropagation(package->data, package->label);
		delete package;
		{
			std::unique_lock<std::mutex> lock(client->outputMutex);
			for (size_t i = 0; i < _net.dims.size() - 1; i++) {
				client->resultSum.weightsGradient[i] += result.weightsGradient[i];
				client->resultSum.biasesGradient[i] += result.biasesGradient[i];
			}
			++client->tasksDone;
		}
	}
}

bool LearningClient::isDone() { return tasksDone >= sampleSize; }

void LearningClient::launch(size_t sampleSize) {
	if (!isDone()) throw "Currant process is unfinished; can't launch new";

	this->sampleSize = sampleSize;
	tasksDone = 0;
	awakeWorkers.notify_all();
}
void LearningClient::launch() { launch(_stream->size()); }

void LearningClient::calcAverage() {
	if (tasksDone > 1) {
		for (size_t i = 0; i < layCount; i++) {
			resultSum.weightsGradient[i].forEach([count = tasksDone](double& el) { el /= count; });
			std::for_each(resultSum.biasesGradient[i].begin(), resultSum.biasesGradient[i].end(),
				[count = tasksDone](double& el) { el /= count; });
		}
	}
}

const NeuralNetwork::backPropagation_Result LearningClient::getResult() {
	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);
	if (!isDone()) workDone.wait(selfLock);
	return resultSum;
}

void LearningClient::abort() { sampleSize = 0; }

void LearningClient::assignStream(MNIST_DSStream* stream) {
	std::unique_lock<std::mutex> lock(streamMutex);
	_stream = stream;
}