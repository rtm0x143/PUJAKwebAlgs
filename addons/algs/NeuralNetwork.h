#pragma once
#include <vector>
#include "../utils/Matrix.h"

class NeuralNetwork
{
public:
	NeuralNetwork(const std::vector<size_t>& dimensions, Matrix<double>* weights, 
		std::vector<double>* biases,
		double(*activFunc)(const double&), double(*derivActivFunc)(const double&));
	
	NeuralNetwork(NeuralNetwork& other);
	~NeuralNetwork();

	double* feedForward(const std::vector<double>& input) const;

	struct Package {
		std::vector<double> data;
		uint8_t label;
	};

	struct backPropagation_Result {
		Matrix<double>* weightsGradient;
		std::vector<double>* biasesGradient;
		size_t layersCount;
		bool is_data_owner;

		backPropagation_Result();
		backPropagation_Result(size_t layersCount);
		~backPropagation_Result();

		backPropagation_Result& operator+=(backPropagation_Result&);
		backPropagation_Result& operator/=(double divider);
	};

	backPropagation_Result* train(const std::vector<double>& data, uint8_t label) const;

	void useSoftMax();

	const std::vector<size_t> dims;

private:
	Matrix<double>* weights;

	double(*activate)(const double&);
	double(*derActivate)(const double&);

	double(*activateLast)(const double&);
	double(*derActivateLast)(const double&);

	std::vector<double>* sums;
	std::vector<double>* neurons;
	Matrix<double>* errors; // 1 row matrices 

	// optional
	std::vector<double>* offsets;
	bool softMax;
};
