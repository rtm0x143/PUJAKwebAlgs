#pragma once
#include "Matrix.h"

struct DataSetPackage {
	std::vector<double> data;
	uint8_t label;
};

typedef std::vector<DataSetPackage> Dataset;

namespace NetIO
{
	void uploadWeights(const std::string& path, const Matrix<double>* weights,
		const std::vector<size_t>& dimensions);

	Matrix<double>* downloadWeights(const std::string& path, std::vector<size_t>& dimensions);

	void uploadBiases(const std::string& path, std::vector<double>* biases,
		const std::vector<size_t>& dimensions);

	std::vector<double>* downloadBiases(const std::string& path);

	Dataset download_MNIST_Dataset_MultiThread(
		const std::string& pathToImg, const std::string& pathTolabel, size_t workersCount);
}
