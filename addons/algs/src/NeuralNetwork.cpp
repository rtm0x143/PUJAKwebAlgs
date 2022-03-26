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
}

NeuralNetwork::~NeuralNetwork() { delete[] neurons, errors, sums; }

NeuralNetwork::backPropagation_Result::backPropagation_Result(bool bindData)
	: is_data_owner(bindData) {};

NeuralNetwork::backPropagation_Result::~backPropagation_Result() {
	delete[] weightsGradient, biasesGradient;
}

double* NeuralNetwork::feedForward(const std::vector<double>& input) const
{
	neurons[0] = input;
	for (size_t l = 1; l < dims.size(); l++) {
		sums[l] = weights[l - 1] * neurons[l - 1];
		sums[l] += offsets[l];
		neurons[l] = sums[l];
		std::for_each(neurons[l].begin(), neurons[l].end(),
			[func = activate](double& el) { el = func(el); });
	}
	return neurons[dims.size() - 1].data();
}

NeuralNetwork::backPropagation_Result NeuralNetwork::backPropagation(const std::vector<double>& input, 
	uint8_t expected) const
{
	feedForward(input);

	size_t lastLayInd = dims.size() - 1;
	backPropagation_Result result(true);
	result.weightsGradient = new Matrix<double>[lastLayInd];
	result.biasesGradient = new std::vector<double>[dims.size()];
	{
		double* errorsLastLay = errors[lastLayInd][0];
		for (size_t i = 0; i < dims.back(); i++) {
			errorsLastLay[i] = 2 * (neurons[lastLayInd][i] - (i == expected ? 1 : 0));
		}
	}

	for (int i = lastLayInd - 1; i >= 0; --i)
	{
		Matrix<double>& weightsLay = weights[i];
		double* errorsLay = errors[i + 1][0];
		
		std::vector<double> semiCalc = sums[i + 1];
		std::for_each(semiCalc.begin(), semiCalc.end(),
			[func = derActivate](double& el) { el = func(el); });
		for (size_t i = 0; i < semiCalc.size(); ++i) {
			semiCalc[i] *= errorsLay[i];
		}

		result.weightsGradient[i] = semiCalc * Matrix<double>(neurons[i]);

		result.biasesGradient[i + 1] = semiCalc;

		errors[i] = Matrix<double>(semiCalc) * weightsLay;
	}

	return result;
}
