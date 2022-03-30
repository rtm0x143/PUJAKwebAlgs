#include <algorithm>
#include "../NeuralNetwork.h"
#include "../../utils/tools.h"

using namespace vectorExtention;

NeuralNetwork::NeuralNetwork(const std::vector<size_t>& dimensions, Matrix<double>* weights, 
	std::vector<double>* biases, double(*activFunc)(const double&), double(*derivActivFunc)(const double&)) 
	: dims(dimensions), 
	weights(weights), 
	offsets(biases),
	activate(activFunc), 
	derActivate(derivActivFunc), 
	activateLast(activFunc),
	derActivateLast(derivActivFunc),
	softMax(false)
{
	sums = new std::vector<double>[dims.size()];
	neurons = new std::vector<double>[dims.size()];
	errors = new Matrix<double>[dims.size()];
	errors[dims.size() - 1] = Matrix<double>(1, dims.back());
}

void NeuralNetwork::useSoftMax() { softMax = true; }

NeuralNetwork::NeuralNetwork(NeuralNetwork& other) :
	dims(other.dims),
	weights(other.weights),
	activate(other.activate),
	derActivate(other.derActivate),
	offsets(other.offsets),
	softMax(other.softMax)
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
	is_data_owner(false), weightsGradient(nullptr), biasesGradient(nullptr), layersCount(0) {}

NeuralNetwork::backPropagation_Result::backPropagation_Result(size_t layersCount) 
	: is_data_owner(true), layersCount(layersCount)
{
	weightsGradient = new Matrix<double>[layersCount - 1];
	biasesGradient = new std::vector<double>[layersCount];
};

NeuralNetwork::backPropagation_Result::~backPropagation_Result() {
	if (is_data_owner) {
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
		weightsGradient[i - 1].forEach([&divider](double& el) { el /= divider; });
		std::vector<double>& bGradient = biasesGradient[i];
		for (size_t j = 0; j < bGradient.size(); j++) {
			bGradient[j] /= divider;
		}
	}
	return *this;
}

double* NeuralNetwork::feedForward(const std::vector<double>& input) const
{
	neurons[0] = input;
	size_t lastLay = dims.size() - 1;
	for (size_t l = 1; l < lastLay; ++l) {
		sums[l] = weights[l - 1] * neurons[l - 1];
		sums[l] += offsets[l];
		neurons[l] = sums[l];
		std::for_each(neurons[l].begin(), neurons[l].end(),
			[func = activate](double& el) { el = func(el); });
	}

	sums[lastLay] = weights[lastLay - 1] * neurons[lastLay - 1];
	sums[lastLay] += offsets[lastLay];
	if (!softMax) {
		neurons[lastLay] = sums[lastLay];
		std::for_each(neurons[lastLay].begin(), neurons[lastLay].end(),
			[func = activate](double& el) { el = func(el); });
	}
	else {
		std::vector<double>& _sums = sums[lastLay];
		std::vector<double> exponents(dims.back());
		double expSum = 0;
		for (size_t i = 0; i < dims.back(); ++i) {
			exponents[i] = exp(_sums[i]);
			expSum += exponents[i];
		}
		std::vector<double>& _neurons = neurons[lastLay];
		_neurons = std::vector<double>(dims.back());
		for (size_t i = 0; i < dims.back(); ++i) {
			_neurons[i] = exponents[i] / expSum;
		}
	}
	return neurons[dims.size() - 1].data();
}

// using func value aas input
double derSoftMax(const double& f) { return f * (1 - f); }

NeuralNetwork::backPropagation_Result* NeuralNetwork::train(
	const std::vector<double>& data, uint8_t label) const
{
	feedForward(data);

	size_t lastLayInd = dims.size() - 1;
	backPropagation_Result* result = new backPropagation_Result(dims.size());
	{
		double* errorsLastLay = errors[lastLayInd][0];
		for (size_t i = 0; i < dims.back(); i++) {
			errorsLastLay[i] = 2 * (neurons[lastLayInd][i] - (i == label ? 1 : 0));
		}
	}

	for (int l = lastLayInd - 1; l >= 0; --l)
	{
		Matrix<double>& weightsLay = weights[l];
		double* errorsLay = errors[l + 1][0];
		
		std::vector<double> semiCalc = sums[l + 1];
		std::for_each(semiCalc.begin(), semiCalc.end(),
			[func = ((softMax && l == lastLayInd - 1) ? derSoftMax : derActivate)] 
				(double& el) { el = func(el); });

		if (!semiCalc[0] && semiCalc[0] != 0)
			std::cout << "bruh";

		for (size_t i = 0; i < semiCalc.size(); ++i) {
			semiCalc[i] *= errorsLay[i];
		}

		result->weightsGradient[l] = semiCalc * Matrix<double>(neurons[l]);
		
		result->biasesGradient[l + 1] = semiCalc;

		if (l) errors[l] = Matrix<double>(semiCalc) * weightsLay;
	}

	return result;
}