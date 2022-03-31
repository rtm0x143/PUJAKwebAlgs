#pragma once
#include <vector>
#include <random>

class NeuralNetworkV
{
private:
	struct Layer
	{
		double** weights;
		double* biases;
		// it's z
		double* weightedSums;
		double* activationValues;
		size_t size;

		Layer();
		Layer(double** weights, double* bias, size_t size);
		Layer(Layer& other);
		Layer(Layer&& other) noexcept;
		~Layer();

		Layer& operator=(Layer&& other) noexcept;
		Layer& operator=(Layer& other);
	};

	std::vector<Layer> layers;

	void initializeLayers(const std::vector<size_t>& dimensions, double*** weights, double** biases);

	void ReLU(Layer& layer);
	double* ReLUDerivative(Layer& layer);
	double ReLUDerivative(double value);

	void softmax(Layer& layer);
	double* softmaxDerivative(Layer& layer);

	void sigmoid(Layer& layer);
	// double* sigmoidDerivative(Layer& layer);
	double sigmoidDerivative(double value);

public:
	//double learningRate;

	struct BackpropResult
	{
		std::vector<size_t> dimensions;
		double*** weights;
		double** biases;

		// Сделать конструктор
		BackpropResult(const std::vector<Layer>& layers);
		BackpropResult& operator +=(BackpropResult& other);
		BackpropResult& operator /=(int countOfImages);

		BackpropResult(BackpropResult&) = delete;
		~BackpropResult();
	};

	/// <summary>
	///
	/// </summary>
	/// <param name="dimensions"></param>
	/// <param name="weights">Weights should be null on the last layer</param>
	/// <param name="biases">Biases should be null on the first layer</param>
	NeuralNetworkV(const std::vector<size_t>& dimensions, double*** weights, double** biases);

	NeuralNetworkV(const std::vector<size_t>& dimensions);
	
	NeuralNetworkV(NeuralNetworkV& other);

	~NeuralNetworkV();

	uint8_t feedForward(std::vector<double>& input);

	BackpropResult* backporp(int expectedResult);

	void shiftWeightAndBiases(BackpropResult* backpropResult);

	BackpropResult* train(std::vector<double>& input, uint8_t expectedResult);
};