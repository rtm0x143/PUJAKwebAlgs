#pragma once
#include <cstdint>
#include "Matrix.h"

namespace tools
{
	std::vector<double> normalizeRGBA_Img(uint8_t* imgData, size_t pxCount);

	Matrix<double>* randWeights(const std::vector<size_t>& dimensions);

	std::vector<double>* randBiases(const std::vector<size_t>& dimensions);

	double sigmoid(double x);
	double derSigByValue(double x);

	double RELU(double x);
	double derRELU_ByValue(double x);
}
