#pragma once 
#include <vector>
#include "Matrix.h"

class NeuralNetwork
{
public:
	struct backPropagation_Result {
		Matrix<double>* weightsGradient;
		std::vector<double>* biasesGradient;
		size_t layersCount;
		bool _is_data_owner;

		backPropagation_Result();
		backPropagation_Result(const std::vector<size_t>& dims);
		~backPropagation_Result();

		backPropagation_Result& operator+=(backPropagation_Result&);
		backPropagation_Result& operator/=(double divider);
	};

	NeuralNetwork(const std::vector<size_t>& dimentions,
		Matrix<double>* weights, std::vector<double>* biases,
		double(*activate)(double), double(*derActivByValue)(double));
	NeuralNetwork(NeuralNetwork& other);
	~NeuralNetwork();

	std::vector<size_t> dims;

	uint8_t feedForward(const std::vector<double>& input);

	void backPropagation(uint8_t expected, backPropagation_Result* resultSum, 
		double learningRate);

	void train(const std::vector<double>& input, uint8_t expected,
		backPropagation_Result* resultSum, double learningRate = 1);

	void printNeurons();

	Matrix<double>* weights;
	std::vector<double>* biases;

private:
	double(*activate)(double);
	double(*derActivByValue)(double);

	std::vector<double>* neurons;
	std::vector<double>* errors;
};