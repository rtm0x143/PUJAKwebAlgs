#pragma once 
#include <vector>
#include "Matrix.h"

namespace vectorExtention
{
	template <typename T>
	std::vector<T>& operator+=(std::vector<T>& v1, const std::vector<T>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		for (size_t i = 0; i < v1.size(); i++) {
			v1[i] += v2[i];
		}
		return v1;
	}
	template <typename T>
	std::vector<T> operator+(const std::vector<T>& v1, const std::vector<T>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] + v2[i];
		}
		return result;
	}

	template <typename T>
	std::vector<T>& operator-=(std::vector<T>& v1, const std::vector<T>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		for (size_t i = 0; i < v1.size(); i++) {
			v1[i] -= v2[i];
		}
		return v1;
	}
	template <typename T>
	std::vector<T> operator-(const std::vector<T>& v1, const std::vector<T>& v2) {
		if (v1.size() != v2.size()) throw "Only equal sized vectors addition supported";
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] - v2[i];
		}
		return result;
	}

	template <typename T>
	std::vector<T>& operator*=(std::vector<T>& v1, const T& multiplier) {
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			v1[i] *= multiplier;
		}
		return v1;
	}
	template <typename T>
	std::vector<T> operator*(const std::vector<T>& v1, const T& multiplier) {
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			result[i] = v1[i] * multiplier;
		}

		return result;
	}

	template <typename T>
	std::vector<T>& operator/=(std::vector<T>& v1, T& divider) {
		std::vector<T> result(v1.size());
		for (size_t i = 0; i < v1.size(); ++i) {
			v1[i] /= divider;
		}
		return v1;
	}

	template <typename T>
	std::ostream& operator<<(std::ostream& os,std::vector<T>& v1) {
		for (size_t i = 0; i < v1.size(); ++i) {
			os << v1[i] << ' ';
		}
		return os;
	}

	template <typename T>
	Matrix<T> operator*(const std::vector<T> v, const Matrix<T>& m) {
		if (m.rows() != 1) throw "Invalid dimentions for multiplication";

		Matrix<T> result(v.size(), m.colCount());
		T* mRow = m.getRow(0);
		for (size_t i = 0; i < v.size(); ++i)
		{
			T* resultRow = result.getRow(i);
			for (size_t j = 0; j < m.colCount(); ++j) {
				resultRow[j] = v[i] * mRow[j];
			}
		}
		return result;
	}
}