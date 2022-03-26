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

	struct backPropagation_Result {
		Matrix<double>* weightsGradient;
		std::vector<double>* biasesGradient;
		bool is_data_owner;

		backPropagation_Result(bool bindData = false);
		~backPropagation_Result();
	};

	backPropagation_Result backPropagation(const std::vector<double>& input, uint8_t expected) const;

	const std::vector<size_t> dims;

private:
	Matrix<double>* weights;

	double(*activate)(const double&);
	double(*derActivate)(const double&);

	std::vector<double>* sums;
	std::vector<double>* neurons;
	Matrix<double>* errors; // 1 row matrices 

	// optional
	std::vector<double>* offsets;
};

