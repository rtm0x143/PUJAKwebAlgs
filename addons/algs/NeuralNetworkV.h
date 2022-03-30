#pragma once
#include <vector>
#include <random>

class NeuralNetworkV
{
private:
    struct Layer
    {
        double** weights;
        double* bias;
        // it's z
        double* weightedSums;
        double* neuronsError;
        double* activationValues;
        size_t size;

        Layer(double** weights, double* bias, double* weightedSums, double* activationValues, double* neuronsError, size_t size);
    };

    void InitializeLayers(const std::vector<size_t>& dimensions, double*** weights, double** biases);

    void ReLU(Layer& layer);
    double* ReLUDerivative(Layer& layer);
    double ReLUDerivative(double value);

    void Softmax(Layer& layer);
    double* SoftmaxDerivative(Layer& layer);

    void Sigmoid(Layer& layer);
    double* SigmoidDerivative(Layer& layer);
    double SigmoidDerivative(double value);

    std::vector<double>& LossFunction(Layer& output);

public:
    struct BackpropResult
    {
        std::vector<size_t>& dimensions;
        double*** weights;
        double** biases;

        BackpropResult& operator +=(BackpropResult& other);
        BackpropResult& operator /=(int countOfImages);

        BackpropResult(BackpropResult&) = delete;
        ~BackpropResult();
    };

    std::vector<Layer> layers;
    double learningRate;

    NeuralNetworkV(const std::vector<size_t>& dimensions, double*** weights, double** biases);

    NeuralNetworkV(const std::vector<size_t>& dimensions);

    int FeedForward(double* input);

    void CalculateErrors();

    void Backporp();
};