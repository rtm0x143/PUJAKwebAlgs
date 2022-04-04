#include "tools.h"
#include <cmath>
#include <fstream>
#include <iostream>

const uint32_t MAX_PX_VAL = 3 * 255 * 255;

std::vector<double> tools::normalizeRGBA_Img(uint8_t* imgData, size_t pxCount){
	std::vector<double> normalized(pxCount);
	for (size_t i = 0; i < pxCount * 4; i += 4) {
		normalized[i / 4] = (double)((imgData[i] + imgData[i + 1] + imgData[i + 2]) * imgData[i + 3]) / MAX_PX_VAL;
	}
	return normalized;
}

Matrix<double>* tools::randWeights(const std::vector<size_t>& dimensions) 
{
	Matrix<double>* weights = new Matrix<double>[dimensions.size() - 1];
	for (size_t i = 0; i < dimensions.size() - 1; i++) 
	{
		weights[i] = Matrix<double>(dimensions[i + 1], dimensions[i]);

		weights[i].map([rowCount = dimensions[i + 1]](double& el) {
			return ((rand() % 100)) * 0.03 / (rowCount + 35);
		});

		//std::cout << weights[i] << '\n' << '\n';
	}
	return weights;
}

std::vector<double>* tools::randBiases(const std::vector<size_t>& dimensions) 
{
	std::vector<double>* biases = new std::vector<double>[dimensions.size()];
	for (size_t l = 1; l < dimensions.size(); ++l)
	{
		biases[l] = std::vector<double>(dimensions[l]);
		std::vector<double>& biasesLay = biases[l];
		for (size_t i = 0; i < dimensions[l]; ++i) 
		{
			biasesLay[i] = ((rand() % 50)) * 0.06 / (dimensions[l - 1] + 15);
		}
	}
	return biases;
}



double tools::sigmoid(double x) { return 1 / (1 + exp(-x)); }
double tools::derSigByValue(double x) { return x * (1 - x); }

double tools::RELU(double x) { return std::max(0.1 * x, x); }
double tools::derRELU_ByValue(double x) { return (x > 0 ? 1 : 0.1); }