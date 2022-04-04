#include "NetIO.h"
#include <fstream>
#include <thread>


void NetIO::uploadWeights(const std::string& path, const Matrix<double>* weights,
	const std::vector<size_t>& dimensions)
{
	std::ofstream stream(path, std::ios::out | std::ios::binary);
	int layCount = dimensions.size(), temp;
	stream.write((char*)&layCount, sizeof(layCount));

	for (size_t i = 0; i < layCount; i++)
	{
		temp = dimensions[i];
		stream.write((char*)&temp, 4);
	}

	for (size_t l = 0; l < layCount - 1; ++l)
	{
		const Matrix<double>& weightsLay = weights[l];
		stream.write((char*)weightsLay.getRow(0), dimensions[l + 1] * dimensions[l] * 8);
	}
	stream.close();
}

Matrix<double>* NetIO::downloadWeights(const std::string& path, std::vector<size_t>& dimensions) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);

	int layCount;
	stream.read((char*)&layCount, sizeof(int));
	Matrix<double>* weights = new Matrix<double>[layCount - 1];
	
	dimensions = std::vector<size_t>(layCount);
	for (size_t i = 0; i < layCount; i++)
	{
		int temp;
		stream.read((char*)&temp, 4);
		dimensions[i] = temp;
	}
	
	for (size_t l = 0; l < layCount - 1; ++l)
	{
		weights[l] = Matrix<double>(dimensions[l + 1], dimensions[l]);
		stream.read((char*)weights[l].getRow(0), dimensions[l + 1] * dimensions[l] * 8);
	}
		
	stream.close();
	return weights;
}

void NetIO::uploadBiases(const std::string& path, std::vector<double>* biases,
	const std::vector<size_t>& dimensions)
{
	std::ofstream stream(path, std::ios::out | std::ios::binary);
	{
		int temp = dimensions.size() - 1;
		stream.write((char*)&temp, 4);
	}
	for (size_t l = 1; l < dimensions.size(); ++l)
	{
		int size = biases[l].size();
		stream.write((char*)&size, 4);
		stream.write((char*)biases[l].data(), size * 8);
	}
	stream.close();
}

std::vector<double>* NetIO::downloadBiases(const std::string& path) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);

	int count;
	stream.read((char*)&count, 4);
	std::vector<double>* biases = new std::vector<double>[count + 1];

	for (size_t l = 1; l <= count; ++l)
	{
		int size;
		stream.read((char*)&size, 4);
		biases[l] = std::vector<double>(size);
		stream.read((char*)biases[l].data(), size * 8);
	}
	stream.close();
	return biases;
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


Dataset NetIO::download_MNIST_Dataset_MultiThread(
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
	{
		std::vector<uint8_t> buffer(imgSize * datasetSize);

		istream.read((char*)buffer.data(), buffer.size());
		normalize_MultiThread(buffer, imgSize, dataset, workersCount);
	}

	uint8_t* buffer = new uint8_t[datasetSize];
	lstream.read((char*)buffer, datasetSize);
	for (size_t i = 0; i < datasetSize; ++i)
	{
		dataset[i].label = buffer[i];
	}

	return dataset;
}