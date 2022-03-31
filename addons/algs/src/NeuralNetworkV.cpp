#include "../NeuralNetworkV.h"
#include <iostream>

NeuralNetworkV::Layer::Layer() :
	weights(nullptr),
	biases(nullptr),
	weightedSums(nullptr),
	activationValues(nullptr),
	size(0) {};

NeuralNetworkV::Layer::Layer(double** weights, double* bias, size_t size) :
	weights(weights),
	biases(bias),
	size(size) 
{
	weightedSums = (double*)malloc(size * 8);
	activationValues = (double*)malloc(size * 8);
}

NeuralNetworkV::Layer::Layer(Layer& other) : Layer(other.weights, other.biases, other.size)
{
	if (other.activationValues) {
		for (size_t i = 0; i < size; ++i)
			activationValues[i] = other.activationValues[i];
	}
	if (other.weightedSums) {
		for (size_t i = 0; i < size; ++i)
			weightedSums[i] = other.weightedSums[i];
	}
}

NeuralNetworkV::Layer::Layer(Layer&& other) noexcept : 
	size(other.size), weights(other.weights), biases(other.biases), 
	activationValues(other.activationValues), weightedSums(other.weightedSums)
{
	other.activationValues = nullptr;
	other.weightedSums= nullptr;
	other.size = 0;
}

NeuralNetworkV::Layer::~Layer()
{
	free(activationValues);
	if (weightedSums) free(weightedSums);
}

NeuralNetworkV::Layer& NeuralNetworkV::Layer::operator=(Layer&& other) noexcept
{
	size = other.size;
	weights = other.weights;
	biases = other.biases;
	free(activationValues);
	free(weightedSums);
	activationValues = other.activationValues;
	weightedSums = other.weightedSums;

	other.activationValues = nullptr;
	other.weightedSums = nullptr;
	other.size = 0;

	return *this;
}

NeuralNetworkV::Layer& NeuralNetworkV::Layer::operator=(Layer& other)
{
	if (this == &other) return *this;

	size = other.size;
	weights = other.weights;
	biases = other.biases;

	for (size_t i = 0; i < size; ++i)
	{
		activationValues[i] = other.activationValues[i];
		weightedSums[i] = other.weightedSums[i];
	}
}

void NeuralNetworkV::initializeLayers(const std::vector<size_t>& dimensions, double*** weights, double** biases)
{
	layers[0].weights = weights[0];
	layers[0].size = dimensions[0];
	for (size_t i = 1; i < dimensions.size(); ++i)
	{
		layers[i] = Layer(weights[i], biases[i],  dimensions[i]);
	}
}

NeuralNetworkV::NeuralNetworkV(const std::vector<size_t>& dimensions, 
	double*** weights, double** biases) : layers(dimensions.size())
{
	initializeLayers(dimensions, weights, biases);
}

NeuralNetworkV::NeuralNetworkV(const std::vector<size_t>& dimensions) : layers(dimensions.size())
{
	std::random_device randomValue;
	std::mt19937 gen(randomValue());

	double*** weights = (double***)malloc(dimensions.size() * sizeof(double**));

	for (size_t l = 0; l < dimensions.size() - 1; l++)
	{
		weights[l] = new double* [dimensions[l]];
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			double* weightsli = new double[dimensions[l + 1]];
			weights[l][i] = weightsli;
			for (size_t j = 0; j < dimensions[l + 1]; j++)
			{
				weightsli[j] = (double)gen() / gen.max();
			}
		}
	}

	double** biases = new double* [dimensions.size() - 2];

	for (size_t l = 1; l < dimensions.size(); l++)
	{
		biases[l] = new double[dimensions[l]];
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			biases[l][i] = (double)gen() / gen.max();
		}
	}

	initializeLayers(dimensions, weights, biases);
	delete[] weights;
}

NeuralNetworkV::NeuralNetworkV(NeuralNetworkV& other) : layers(other.layers) {}

NeuralNetworkV::~NeuralNetworkV() {
	layers[0].activationValues = nullptr;
}

void NeuralNetworkV::ReLU(Layer& layer)
{
	for (size_t i = 0; i < layer.size; i++)
	{
		layer.activationValues[i] = std::max(0.0, layer.weightedSums[i]);
	}
}

// Спросить у Артёма, удалится ли лишний поинтер на массив из даблов
double* NeuralNetworkV::ReLUDerivative(Layer& layer)
{
	double* derivatives = new double[layer.size];

	for (size_t i = 0; i < layer.size; i++)
	{
		if (layer.weightedSums[i] < 0)
		{
			derivatives[i] = 0;
		}
		else if (layer.weightedSums[i > 0])
		{
			derivatives[i] = 1;
		}
		else
		{
			derivatives[i] = -1;
		}
	}

	return derivatives;
}

double NeuralNetworkV::ReLUDerivative(double value) { return (value > 0 ? 1 : 0); }

void NeuralNetworkV::softmax(Layer& layer)
{
	double* expWeightedSums = new double[layer.size];
	double expSum = 0;

	for (size_t i = 0; i < layer.size; i++)
	{
		expWeightedSums[i] = std::exp(layer.weightedSums[i]);
		expSum += expWeightedSums[i];
	}

	for (size_t i = 0; i < layer.size; i++)
	{
		layer.activationValues[i] = expWeightedSums[i] / expSum;
	}
}

//// В последнем слое будут находиться уже вычисленные через Softmax значения экспонент
//double* NeuralNetworkV::SoftmaxDerivative(Layer& layer)
//{
//	double expSum = 0;
//
//	for (size_t i = 0; i < layer.size; i++)
//	{
//		expSum += layer.activationValues[i];
//	}
//
//
//}

void NeuralNetworkV::sigmoid(Layer& layer) 
{
	for (size_t i = 0; i < layer.size; i++)
	{
		layer.activationValues[i] = 1 / (1 + std::exp(-layer.weightedSums[i]));
	}
}

double NeuralNetworkV::sigmoidDerivative(double value)
{
	return exp(value) / pow(exp(value) + 1, 2);
}

// Максимум для 256 нейронов на последнем слое
uint8_t NeuralNetworkV::feedForward(std::vector<double>& input)
{
	layers[0].activationValues = input.data();

	for (size_t l = 1; l < layers.size(); l++)
	{
		for (size_t i = 0; i < layers[l].size; i++)
		{
			for (size_t j = 0; j < layers[l - 1].size; j++)
			{
				// j - откуда, i - куда
				layers[l].weightedSums[i] = layers[l - 1].weights[j][i] * layers[l - 1].activationValues[j];
			}
		}

		if (l < layers.size() - 1)
		{
			ReLU(layers[l]);
		}
		else
		{
			softmax(layers[l]);
		}
	}

	uint8_t maxIndex = 0;
	double* lastLayerActivationValues = layers[layers.size() - 1].activationValues;

	for (size_t i = 0; i < layers[layers.size() - 1].size; i++)
	{
		if (lastLayerActivationValues[i] > lastLayerActivationValues[maxIndex])
		{
			maxIndex = i;
		}
	}

	return maxIndex;
}

NeuralNetworkV::BackpropResult& NeuralNetworkV::BackpropResult::operator+=(BackpropResult& other) {
	for (size_t l = 0; l < dimensions.size() - 1; l++)
	{
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			for (size_t j = 0; j < dimensions[l + 1]; j++)
			{
				weights[l][i][j] += other.weights[l][i][j];
			}
		}
	}

	for (size_t l = 1; l < dimensions.size() - 1; l++)
	{
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			biases[l][i] += other.biases[l][i];
		}
	}

	return *this;
}

NeuralNetworkV::BackpropResult& NeuralNetworkV::BackpropResult::operator/=(int countOfImages)
{
	for (size_t l = 0; l < dimensions.size() - 1; l++)
	{
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			for (size_t j = 0; j < dimensions[l + 1]; j++)
			{
				weights[l][i][j] /= countOfImages;
			}
		}
	}

	for (size_t l = 1; l < dimensions.size(); l++)
	{
		for (size_t i = 0; i < dimensions[l]; i++)
		{
			biases[l][i] /= countOfImages;
		}
	}

	return *this;
}

NeuralNetworkV::BackpropResult::BackpropResult(const std::vector<Layer>& layers)
{
	dimensions = std::vector<size_t>(layers.size());
	weights = (double***)malloc(layers.size() * sizeof(double**));
	biases = (double**)malloc(layers.size() * sizeof(double*));

	for (size_t i = 0; i < dimensions.size(); i++)
	{
		dimensions[i] = layers[i].size;

		if (i < dimensions.size() - 1)
		{
			weights[i] = new double*[dimensions[i]];
			for (size_t j = 0; j < dimensions[i]; ++j)
			{
				weights[i][j] = new double[layers[i + 1].size];
				if (!*weights[i][j])
				{
					free(weights[i][j]);
					--j;
				}
			}
			/*size_t rowSize = layers[i + 1].size;
			weights[i][0] = (double*)malloc(dimensions[i] * rowSize * sizeof(double));
			double* row = weights[i][0];
			for (size_t j = 1; j < dimensions[i]; ++j)
			{
				row += rowSize;
				weights[i][j] = row;
			}*/
		}
		else
		{
			weights[i] = nullptr;
		}

		if (i > 0)
		{
			biases[i] = (double*)malloc(dimensions[i] * 8);
		}
		else
		{
			biases[i] = nullptr;
		}
	}
}

NeuralNetworkV::BackpropResult::~BackpropResult()
{
	for (size_t l = 0; l < dimensions.size() - 1; l++)
	{
		free(biases[l + 1]);
		/*for (size_t i = 0; i < dimensions[l]; i++)
		{
			free(weights[l][i]);
		}*/
		free(weights[l][0]);
		free(weights[l]);
	}

	free(biases);
	free(weights);
}

NeuralNetworkV::BackpropResult* NeuralNetworkV::backporp(int expectedResult)
{
	double** deltas = (double**)malloc(layers.size() * sizeof(double*));

	for (size_t l = 1; l < layers.size(); l++)
	{
		deltas[l] = (double*)malloc(layers[l].size * 8);
		if (!deltas[l])
		{
			free(deltas[l]);
			--l;
		}
	}
	
	for (size_t i = 0; i < layers.size() - 1; i++)
	{
		if (i != expectedResult)
		{
			deltas[layers.size() - 1][i] = 2 * layers[layers.size() - 1].activationValues[i]
				* sigmoidDerivative(layers[layers.size() - 1].weightedSums[i]);
		}
		else
		{
			deltas[layers.size() - 1][i] = 2 * (layers[layers.size() - 1].activationValues[i] - 1)
				* sigmoidDerivative(layers[layers.size() - 1].weightedSums[i]);
		}
	}

	for (size_t k = layers.size() - 2; k > 0; k--)
	{
		// Rows
		for (size_t i = 0; i < layers[k].size; i++)
		{
			double temp = 0;
			// Columns
			for (size_t j = 0; j < layers[k + 1].size; j++)
			{
				temp += layers[k].weights[i][j] * deltas[k + 1][j];
			}
		
			deltas[k][i] = temp * ReLUDerivative(layers[k].weightedSums[i]);
		}
	}

	BackpropResult* backpropResult = new BackpropResult(layers);
 
	for (size_t l = 0; l < layers.size() - 1; l++)
	{
		for (size_t i = 0; i < layers[l + 1].size; i++)
		{
			for (size_t j = 0; j < layers[l].size; j++)
			{
				backpropResult->weights[l][j][i] = layers[l].activationValues[j] * deltas[l + 1][i]; //* learningRate;
			}

			backpropResult->biases[l + 1][i] = deltas[l + 1][i]; //* learningRate;
			//std::cout << backpropResult->biases[l + 1][i] << ' ';
		}
	}

	for (size_t l = 1; l < layers.size(); l++)
	{
		delete[] deltas[l];
	}

	free(deltas);

	return backpropResult;
}

void NeuralNetworkV::shiftWeightAndBiases(BackpropResult* backpropResult)
{
	for (size_t l = 0; l < layers.size() - 1; l++)
	{
		for (size_t i = 0; i < layers[l + 1].size; i++)
		{
			for (size_t j = 0; j < layers[l].size; j++)
			{
				layers[l].weights[j][i] -= backpropResult->weights[l][j][i];
			}

			layers[l + 1].biases[i] -= backpropResult->biases[l + 1][i];
		}
	}
}

NeuralNetworkV::BackpropResult* NeuralNetworkV::train(std::vector<double>& input, uint8_t expectedResult)
{
	feedForward(input);
	return backporp(expectedResult);
}
