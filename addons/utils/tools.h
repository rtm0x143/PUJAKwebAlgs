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
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] * v2[i];
		}

		return result;
	}

	template <typename T>
	Matrix<T> operator*(const std::vector<T> v, const Matrix<T>& m) {
		if (m.rows() != 1) throw "Invalid dimentions for multiplication";

		Matrix<T> result(v.size(), m.columns());
		T* mRow = m[0];
		for (size_t i = 0; i < v.size(); ++i)
		{
			T* resultRow = result[i];
			for (size_t j = 0; j < m.columns(); ++j) {
				resultRow[j] = v[i] * mRow[j];
			}
		}
		return result;
	}
}