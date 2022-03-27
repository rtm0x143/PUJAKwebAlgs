#include "../tools.h"
#include <cmath>
#include <fstream>

const uint32_t MAX_PX_VAL = 3 * 255 * 255;

double* tools::normalizeRGBA_Img(uint8_t* imgData, size_t pxCount) {
	double* normalized = new double[pxCount];
	for (size_t i = 0; i < pxCount * 4; i += 4) {
		normalized[i / 4] = (double)((imgData[i] + imgData[i + 1] + imgData[i + 2]) * imgData[i + 3]) / MAX_PX_VAL;
	}
	return normalized;
}

Matrix<double>* tools::randWeights(const std::vector<size_t>& dimensions) {
	Matrix<double>* weights = new Matrix<double>[dimensions.size() - 1];
	for (size_t i = 0; i < dimensions.size() - 1; i++) {
		weights[i] = Matrix<double>(dimensions[i + 1], dimensions[i]);
		weights[i].forEach([](double& el) { el = (double)rand() / RAND_MAX / 5; });
	}
	return weights;
}

void tools::uploadWeights(const std::string& path, const Matrix<double>* weights,
	const std::vector<size_t>& dimensions) 
{
	std::ofstream stream(path, std::ios::out | std::ios::binary);
	size_t layCount = dimensions.size();
	stream.write((char*)&layCount, sizeof(layCount));
	stream.write((char*)dimensions.data(), sizeof(size_t));

	for (size_t l = 1; l < layCount; ++l)
	{
		stream.write((char*)(dimensions.data() + l), sizeof(size_t));
		const Matrix<double>& weightsLay = weights[l - 1];
		for (size_t i = 0; i < dimensions[l]; ++i) {
			stream.write((char*)weightsLay[i], dimensions[l - 1] * 8);
		}
	}
	stream.close();
}

Matrix<double>* tools::downloadWeights(const std::string& path, std::vector<size_t>& dimensions) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);
	
	size_t layCount;
	stream.read((char*)&layCount, sizeof(size_t));
	Matrix<double>* weights = new Matrix<double>[layCount - 1];
	dimensions = std::vector<size_t>(layCount);

	stream.read((char*)dimensions.data(), sizeof(size_t));

	for (size_t l = 1; l < layCount; ++l)
	{
		stream.read((char*)(dimensions.data() + l), sizeof(size_t));
		Matrix<double>& weightsLay = weights[l - 1];
		weightsLay = Matrix<double>(dimensions[l], dimensions[l - 1]);
		for (size_t i = 0; i < dimensions[l]; i++) {
			stream.read((char*)weightsLay[i], dimensions[l - 1] * 8);
		}
	}
	stream.close();
	return weights;
}

std::vector<double>* tools::randBiases(const std::vector<size_t>& dimensions) {
	std::vector<double>* biases = new std::vector<double>[dimensions.size()];
	for (size_t l = 1; l < dimensions.size(); ++l)
	{
		std::vector<double>& biasesLay = biases[l];
		biasesLay = std::vector<double>(dimensions[l]);
		for (size_t i = 0; i < dimensions[l]; ++i) {
			biasesLay[i] = (double)(rand() * 10) / RAND_MAX - 5;
		}
	}
	return biases;
}

void tools::uploadBiases(const std::string& path, const std::vector<double>* biases,
	const std::vector<size_t>& dimensions)
{
	std::ofstream stream(path, std::ios::out | std::ios::binary);
	{
		size_t temp = dimensions.size() - 1;
		stream.write((char*)&temp, sizeof(size_t));
	}
	for (size_t l = 1; l < dimensions.size(); ++l)
	{
		size_t size = biases[l].size();
		stream.write((char*)&size, sizeof(size_t));
		stream.write((char*)biases[l].data(), size * 8);
	}
	stream.close();
}

std::vector<double>* tools::downloadBiases(const std::string& path) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);
	size_t count;
	stream.read((char*)&count, sizeof(size_t));
	std::vector<double>* biases = new std::vector<double>[count + 1];

	for (size_t l = 1; l <= count; ++l)
	{
		size_t size;
		stream.read((char*)&size, sizeof(size_t));
		biases[l] = std::vector<double>(size);
		stream.read((char*)biases[l].data(), size * 8);
	}
	stream.close();
	return biases;
}

double tools::sigmoid(const double& x) { return 1 / (1 + exp(-x)); }
double tools::derSig(const double& x) { return sigmoid(x) * (1 - sigmoid(x)); }
