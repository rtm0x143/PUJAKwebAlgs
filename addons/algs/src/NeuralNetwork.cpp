#include <algorithm>
#include "../NeuralNetwork.h"
#include "../../utils/tools.h"

using namespace vectorExtention;

NeuralNetwork::NeuralNetwork(const std::vector<size_t>& dimensions, Matrix<double>* weights, 
	std::vector<double>* biases, double(*activFunc)(const double&), double(*derivActivFunc)(const double&)) 
	: dims(dimensions), weights(weights), activate(activFunc), derActivate(derivActivFunc), offsets(biases)
{
	sums = new std::vector<double>[dims.size()];
	neurons = new std::vector<double>[dims.size()];
	errors = new Matrix<double>[dims.size()];
	errors[dims.size() - 1] = Matrix<double>(1, dims.back());
}

NeuralNetwork::NeuralNetwork(NeuralNetwork& other) : dims(other.dims), weights(other.weights), 
	activate(other.activate), derActivate(other.derActivate), offsets(other.offsets)
{
	sums = new std::vector<double>[dims.size()];
	neurons = new std::vector<double>[dims.size()];
	errors = new Matrix<double>[dims.size()];
	errors[dims.size() - 1] = Matrix<double>(1, dims.back());
}

NeuralNetwork::~NeuralNetwork() {
	delete[] neurons;
	delete[] errors;
	delete[] sums;
}

NeuralNetwork::backPropagation_Result::backPropagation_Result() : 
	is_data_owner(false), weightsGradient(nullptr), biasesGradient(nullptr) {}

NeuralNetwork::backPropagation_Result::backPropagation_Result(size_t weightsGradientSize, 
	size_t biasesGradientSize) : is_data_owner(true) 
{
	weightsGradient = new Matrix<double>[weightsGradientSize];
	biasesGradient = new std::vector<double>[biasesGradientSize];
};

NeuralNetwork::backPropagation_Result::~backPropagation_Result() {
	if (is_data_owner) {
		delete[] weightsGradient; 
		delete[] biasesGradient;
	}
}

double* NeuralNetwork::feedForward(const std::vector<double>& input) const
{
	neurons[0] = input;
	for (size_t l = 1; l < dims.size(); ++l) {
		sums[l] = weights[l - 1] * neurons[l - 1];
		sums[l] += offsets[l];
		neurons[l] = sums[l];
		std::for_each(neurons[l].begin(), neurons[l].end(),
			[func = activate](double& el) { el = func(el); });
	}
	return neurons[dims.size() - 1].data();
}

NeuralNetwork::backPropagation_Result* NeuralNetwork::backPropagation(Package& package) const
{
	feedForward(package.data);

	size_t lastLayInd = dims.size() - 1;
	backPropagation_Result* result = new backPropagation_Result(lastLayInd, dims.size());
	{
		double* errorsLastLay = errors[lastLayInd][0];
		for (size_t i = 0; i < dims.back(); i++) {
			errorsLastLay[i] = 2 * (neurons[lastLayInd][i] - (i == package.label ? 1 : 0));
		}
	}

	for (int l = lastLayInd - 1; l >= 0; --l)
	{
		Matrix<double>& weightsLay = weights[l];
		double* errorsLay = errors[l + 1][0];
		
		std::vector<double> semiCalc = sums[l + 1];
		std::for_each(semiCalc.begin(), semiCalc.end(),
			[func = derActivate](double& el) { el = func(el); });
		for (size_t i = 0; i < semiCalc.size(); ++i) {
			semiCalc[i] *= errorsLay[i];
		}

		result->weightsGradient[l] = semiCalc * Matrix<double>(neurons[l]);

		result->biasesGradient[l + 1] = semiCalc;

		if (l) errors[l] = Matrix<double>(semiCalc) * weightsLay;
	}

	return result;
}