#pragma once
#include <cstdint>
#include "Matrix.h"

namespace tools
{
	double* normalizeRGBA_Img(uint8_t* imgData, size_t pxCount);

	Matrix<double>* randWeights(const std::vector<size_t>& dimensions);

	double sigmoid(const double& x);
	double derSig(const double& x); 
}