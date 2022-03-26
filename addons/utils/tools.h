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
	std::vector<T>& operator+=(std::vector<T>& v1, const std::vector<double>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		for (size_t i = 0; i < v1.size(); i++) {
			v1[i] += v2[i];
		}
		return v1;
	}
	template <typename T>
	std::vector<T> operator+(const std::vector<T>& v1, const std::vector<double>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] + v2[i];
		}
		return result;
	}

	template <typename T>
	std::vector<T>& operator*=(std::vector<T>& v1, const std::vector<double>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			v1[i] *= v2[i];
		}
		return v1;
	}
	template <typename T>
	std::vector<T> operator*(const std::vector<T>& v1, const std::vector<double>& v2) {
		/*	if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] * v2[i];
		}*/

		size_t size = v1.size();
		if (size != v2.size()) throw "Only equal sized vectors addition supported";

		std::vector<T> result(size);
		T* pResult = result.data(), * pV1 = v1.data(), * pV2 = v2.data();
		for (size_t i = 0; i < size; ++i, ++pResult, ++pV1, ++pV2) {
			*pResult = *pV1 + *pV2;
		}

		return result;
	}
}