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
namespace vectorExtention
{
	template <typename T>
	std::vector<T>& operator+=(std::vector<T>& v1, const std::vector<double>& v2);
	template <typename T>
	std::vector<T> operator+(const std::vector<T>& v1, const std::vector<double>& v2);

	template <typename T>
	std::vector<T>& operator*=(std::vector<T>& v1, const std::vector<double>& v2);
	template <typename T>
	std::vector<T> operator*(const std::vector<T>& v1, const std::vector<double>& v2);
}