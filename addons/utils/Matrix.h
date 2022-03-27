#pragma once
#include <utility>
#include <iostream>
#include <vector>
//#include "../utils/tools.h"

template <typename T>
class Matrix
{
public:
	Matrix() : c_count(0), r_count(0) {
		data = nullptr;  
		is_data_owner = false;
	}
	Matrix(size_t rowCount, size_t columnCount) {
		is_data_owner = true;
		c_count = columnCount; r_count = rowCount;

		data = new T*[rowCount];
		for (size_t i = 0; i < rowCount; i++) {
			data[i] = new T[columnCount];
		}
	}
	Matrix(size_t rowCount, size_t columnCount, T filler) : Matrix(rowCount, columnCount) {
		for (size_t i = 0; i < rowCount; i++) {
			for (size_t j = 0; j < columnCount; j++) data[i][j] = filler;
		}
	}

	// represents vector as 1 row matrix
	Matrix(std::vector<T>& other) {
		data = new T*(other.data());
		c_count = other.size();
		r_count = 1;
		is_data_owner = false;
	}

	Matrix(Matrix& other) : Matrix(other.r_count, other.c_count) {
		for (size_t i = 0; i < r_count; i++) {
			for (size_t j = 0; j < c_count; j++) data[i][j] = other.data[i][j];
		}
	}

	Matrix(Matrix&& other) noexcept {
		c_count = other.c_count;
		r_count = other.r_count;
		data = other.data;
		is_data_owner = other.is_data_owner;

		other.c_count = 0;
		other.r_count = 0;
		other.is_data_owner = false;
		other.data = nullptr;
	}

	~Matrix() {
		if (is_data_owner)
			for (size_t i = 0; i < r_count; ++i) delete[] data[i];
		delete[] data;
	}

	T* operator[](size_t i) const { return data[i]; }

	Matrix& operator=(const Matrix& other) {
		if (this == &other) return *this; 
		
		c_count = other.c_count; r_count = other.r_count;
		is_data_owner = true;
		data = new T * [r_count];
		for (size_t i = 0; i < r_count; i++) {
			data[i] = new T[c_count];
			for (size_t j = 0; j < c_count; j++) data[i][j] = other.data[i][j];
		}
		return *this;
	}
	Matrix& operator=(Matrix&& other) noexcept {
		if (is_data_owner)
			for (size_t i = 0; i < r_count; ++i) delete[] data[i];
		delete[] data;

		c_count = other.c_count;
		r_count = other.r_count;
		data = other.data;
		is_data_owner = other.is_data_owner;

		other.c_count = 0;
		other.r_count = 0;
		other.data = nullptr;
		other.is_data_owner = false;
		return *this;
	}

	Matrix operator+(const Matrix& other) {
		if (c_count != other.c_count || r_count != other.r_count) throw "Only equal dimention matrices addition allowed";
		
		Matrix<T> result(r_count, c_count);
		for (size_t i = 0; i < r_count; ++i) {
			T* resultRow = result.data[i], * selfRow = data[i], * otherRow = other.data[i];
			for (size_t j = 0; j < c_count; j++) {
				resultRow[j] = selfRow[j] + otherRow[j];
			}
		}
		return result;
	}
	Matrix& operator+=(const Matrix& other) {
		if (c_count != other.c_count || r_count != other.r_count) throw "Only equal dimention matrices addition allowed";

		for (size_t i = 0; i < r_count; ++i) {
			T* otherRow = other.data[i], * selfRow = data[i];
			for (size_t j = 0; j < c_count; j++) {
				selfRow[j] += otherRow[j];
			}
		}
		return *this;
	}

	Matrix operator-(const Matrix& other) {
		if (c_count != other.c_count || r_count != other.r_count) throw "Only equal dimention matrices addition allowed";

		Matrix<T> result(r_count, c_count);
		for (size_t i = 0; i < r_count; ++i) {
			T* resultRow = result.data[i], * selfRow = data[i], * otherRow = other.data[i];
			for (size_t j = 0; j < c_count; j++) {
				resultRow[j] = selfRow[j] - otherRow[j];
			}
		}
		return result;
	}
	Matrix& operator-=(const Matrix& other) {
		if (c_count != other.c_count || r_count != other.r_count) throw "Only equal dimention matrices addition allowed";

		for (size_t i = 0; i < r_count; ++i) {
			T* otherRow = other.data[i], * selfRow = data[i];
			for (size_t j = 0; j < c_count; j++) {
				selfRow[j] -= otherRow[j];
			}
		}
		return *this;
	}

	Matrix operator*(const Matrix& other) {
		if (c_count != other.r_count) throw "Invalid dimentions for multiplication";

		Matrix<T> result(r_count, other.c_count, 0);
		for (size_t i = 0; i < r_count; i++)
		{
			T* resultRow = result.data[i], * selfRow = data[i];
			for (size_t j = 0; j < c_count; j++)
			{
				T cur = selfRow[j], * otherRow = other.data[j];
				for (size_t k = 0; k < other.c_count; k++) {
					resultRow[k] += cur * otherRow[k];
				}
			}
		}
		return result;
	}
	std::vector<T> operator*(const std::vector<T>& other) {
		if (c_count != other.size()) throw "Invalid dimentions for multiplication";

		std::vector<T> result(r_count, 0);
		for (size_t i = 0; i < r_count; i++) {
			T* row = data[i];
			for (size_t j = 0; j < c_count; j++) {
				result[i] += other[j] * row[j];
			}
		}
		return result;
	}

	Matrix slice(size_t rowOffset, size_t collumnOffset) {
		Matrix<T> m;
		m.c_count = c_count - collumnOffset;
		m.r_count = r_count - rowOffset;
		m.data = new T*[m.r_count];
		T** shiftedData = data + rowOffset;
		for (size_t i = 0; i < m.r_count; i++) {
			m.data[i] = shiftedData[i] + collumnOffset;
		}
		return m;
	}

	template <typename Func>
	void forEach(Func func) {
		for (size_t i = 0; i < r_count; ++i) {
			T* row = data[i];
			for (size_t j = 0; j < c_count; j++) func(row[j]);
		}
	}

	size_t columns() const noexcept { return c_count; }
	size_t rows() const noexcept { return r_count; }

	void console_log() {
		for (size_t i = 0; i < r_count; i++) {
			T* row = data[i];
			for (size_t j = 0; j < c_count; j++) {
				std::cout << row[j] << ' ';
			}
			std::cout << '\n';
		}
	}

private:
	T** data;
	size_t c_count, r_count;
	bool is_data_owner;
};

//template <typename T> 
//Matrix<T> operator*(const std::vector<T> v, const Matrix<T>& m) {
//	if (m.r_count != 1) throw "Invalid dimentions for multiplication";
//
//	Matrix<T> result(v.size(), m.c_count);
//	T* mRow = m.data[0];
//	for (size_t i = 0; i < v.size(); ++i)
//	{
//		T* resultRow = result.data[i];
//		for (size_t j = 0; j < m.c_count; ++j) {
//			resultRow[j] = v[i] * mRow[j];
//		}
//	}
//	return result;
//}
