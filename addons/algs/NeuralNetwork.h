#pragma once
#include <vector>
#include "../utils/Matrix.h"

class NeuralNetwork
{
public:
	NeuralNetwork(const std::vector<size_t>& dimensions, Matrix<double>* weights, 
		std::vector<double>* biases,
		double(*activFunc)(const double&), double(*derivActivFunc)(const double&));
	~NeuralNetwork();

	double* feedForward(const std::vector<double>& input) const;

	Matrix<double>* backPropagation(const std::vector<double>& input, uint8_t expected) const;

	const std::vector<size_t> dims;

private:
	Matrix<double>* weights;

	double(*activate)(const double&);
	double(*derActivate)(const double&);

	std::vector<double>* sums;
	std::vector<double>* neurons;
	std::vector<double>* errors;

	// optional
	std::vector<double>* offsets;
};

