#include <algorithm>
#include "NeuralNetwork.h"

NeuralNetwork::NeuralNetwork(const std::vector<size_t>& dimensions, Matrix<double>* weights, 
	std::vector<double>* biases, double(*activFunc)(const double&), double(*derivActivFunc)(const double&)) 
	: dims(dimensions), weights(weights), activate(activFunc), derActivate(derivActivFunc), offsets(biases)
{
	sums = new std::vector<double>[dims.size()];
	neurons = new std::vector<double>[dims.size()];
	errors = new std::vector<double>[dims.size()];
}

NeuralNetwork::~NeuralNetwork() { delete[] neurons, errors, sums; }

double* NeuralNetwork::feedForward(const std::vector<double>& input) const
{
	neurons[0] = input;
	for (size_t l = 1; l < dims.size(); l++) {
		sums[l] = weights[l - 1] * neurons[l - 1];
		sums[l] += offsets[l];
		for (size_t i = 0; i < sums[i].size(); i++) {
			neurons[l][i] = activate(sums[l][i]);
		}
	}
	return neurons[dims.size() - 1].data();
}

Matrix<double>* NeuralNetwork::backPropagation(const std::vector<double>& input, uint8_t expected) const
{
	Matrix<double>* gradient = new Matrix<double>[dims.size() - 1];
	
	size_t lastI = dims.size() - 1;
	for (size_t i = 0; i < dims.back(); i++) {
		errors[lastI][i] = 2 * (neurons[lastI][i] - (i == expected ? 1 : 0));
	}

	return gradient;
}
