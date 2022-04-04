#include <algorithm>
#include <iostream>
#include "NeuralNetwork.h"
#include "vectorExtention.cpp"

using namespace vectorExtention;

NeuralNetwork::backPropagation_Result::backPropagation_Result() 
	: weightsGradient(nullptr), biasesGradient(nullptr), layersCount(0), _is_data_owner(false) {}

NeuralNetwork::backPropagation_Result::backPropagation_Result(const std::vector<size_t>& dims)
	: layersCount(dims.size()), _is_data_owner(true)
{
	weightsGradient = new Matrix<double>[layersCount - 1];
	biasesGradient = new std::vector<double>[layersCount];
	for (size_t l = 0; l < dims.size() - 1; ++l)
	{
		weightsGradient[l] = Matrix<double>(dims[l + 1], dims[l], 0);
		biasesGradient[l + 1] = std::vector<double>(dims[l + 1], 0);
	}
}

NeuralNetwork::backPropagation_Result::~backPropagation_Result() {
	if (_is_data_owner) {
		delete[] weightsGradient;
		delete[] biasesGradient;
	}
}

NeuralNetwork::backPropagation_Result&
NeuralNetwork::backPropagation_Result::operator+=(backPropagation_Result& other)
{
	for (size_t i = 1; i < layersCount; ++i)
	{
		weightsGradient[i - 1] += other.weightsGradient[i - 1];
		biasesGradient[i] += other.biasesGradient[i];
	}
	return *this;
}

NeuralNetwork::backPropagation_Result&
NeuralNetwork::backPropagation_Result::operator/=(double divider)
{
	for (size_t i = 1; i < layersCount; ++i)
	{
		weightsGradient[i - 1] /= divider;
		biasesGradient[i] /= divider;
	}
	return *this;
}


NeuralNetwork::NeuralNetwork(const std::vector<size_t>& dimentions,
	Matrix<double>* weights, std::vector<double>* biases,
	double(*activate)(double), double(*derActivByValue)(double))
	: dims(dimentions), 
	weights(weights), biases(biases),
	activate(activate), derActivByValue(derActivByValue)
{
	neurons = new std::vector<double>[dims.size()];
	errors = new std::vector<double>[dims.size()];

	for (size_t l = 0; l < dims.size(); ++l)
	{
		neurons[l] = std::vector<double>(dims[l]);
		errors[l] = std::vector<double>(dims[l]);
	}
}

NeuralNetwork::NeuralNetwork(NeuralNetwork& other) : 
	NeuralNetwork(other.dims, other.weights, other.biases, 
		other.activate, other.derActivByValue) {}

NeuralNetwork::~NeuralNetwork()
{
	delete[] neurons;
	delete[] errors;
}


uint8_t NeuralNetwork::feedForward(const std::vector<double>& input)
{
	neurons[0] = input;
	for (size_t l = 1; l < dims.size(); ++l)
	{
		weights[l - 1].multiply(neurons[l - 1], neurons[l]);

		neurons[l] += biases[l];

		std::for_each(neurons[l].begin(), neurons[l].end(),
			[func = activate](double& n) { n = func(n); });
	}

	std::vector<double>& outputLay = neurons[dims.size() - 1];
	uint8_t bestNeuron = '\0';
	for (size_t i = 1; i < dims.back(); ++i)
	{
		if (outputLay[i] > outputLay[bestNeuron]) bestNeuron = i;
	}

	return bestNeuron;
}

void NeuralNetwork::backPropagation(uint8_t expected, backPropagation_Result* resultSum,
	double learningRate)
{
	size_t lastInd = dims.size() - 1;
	{
		std::vector<double>& lastErrors = errors[lastInd];
		std::vector<double>& lastNeurons = neurons[lastInd];
		for (size_t i = 0; i < dims.back(); ++i)
		{
			if (i != expected) {
				lastErrors[i] = -lastNeurons[i] * derActivByValue(lastNeurons[i]);
			}
			else {
				lastErrors[i] = (1.0 - lastNeurons[i]) * derActivByValue(lastNeurons[i]);
			}
		}
	}

	for (size_t i = lastInd - 1; i > 0; --i)
	{
		weights[i].multiply_t(errors[i + 1], errors[i]);
		for (int j = 0; j < dims[i]; ++j)
			errors[i][j] *= derActivByValue(neurons[i][j]);
	}

	for (int i = 0; i < lastInd; ++i) 
	{
		Matrix<double>& curWG = resultSum->weightsGradient[i];

		size_t rowCount = dims[i + 1];

		errors[i + 1] *= learningRate;

		double *nLay = neurons[i].data(),
			* eLay = errors[i + 1].data();

		for (int j = 0; j < rowCount; ++j) 
		{
			double* row = curWG.getRow(j);
			size_t colCount = dims[i];

			for (int k = 0; k < colCount; ++k)
			{
				row[k] += nLay[k] * eLay[j];
			}
		}

		resultSum->biasesGradient[i + 1] += errors[i + 1];
	}
}

void NeuralNetwork::train(const std::vector<double>& input, uint8_t expected, 
	backPropagation_Result* resultSum, double learningRate)
{
	feedForward(input);
	backPropagation(expected, resultSum, learningRate);
}

void NeuralNetwork::printNeurons()
{
	for (size_t l = 1; l < dims.size(); l++)
	{
		std::cout << "\t L - " << l << '\n';
		for (double n : neurons[l])
		{
			std::cout << n << ' ';
		}
		std::cout << '\n';
	}
}