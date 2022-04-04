#pragma once 
#include <vector>
#include <ostream>

template <typename T>
class Matrix
{
public:
	Matrix() : rows(0), cols(0) { data = nullptr; }
	Matrix(size_t rowCount, size_t colCount) : rows(rowCount), cols(colCount) 
	{
		_init();
	}
	Matrix(size_t rowCount, size_t colCount, T filler) : Matrix(rowCount, colCount)
	{
		T* curP = data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] = filler;
		}
	}

	Matrix(Matrix& other) : Matrix(other.rows, other.cols)
	{
		T* cur = data[0], * otherCur = other.data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			cur[i] = otherCur[i];
		}
	}
	Matrix(Matrix&& other)
	{
		cols = other.cols;
		rows = other.rows;
		data = other.data;

		other.cols = 0;
		other.rows = 0;
		other.data = nullptr;
	}

	~Matrix()
	{
		if (data) delete data[0];
		delete data;
	}

	Matrix& operator=(Matrix& other)
	{
		if (this == &other) return *this;

		if (data) delete data[0];
		delete data;

		cols = other.cols;
		rows = other.rows;

		_init();
		T* curP = data[0], * otherCurP = other.data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] = otherCurP[i];
		}

		return *this;
	}
	Matrix& operator=(Matrix&& other)
	{
		if (this == &other) return *this;;

		if (data) delete data[0];
		delete data;

		data = other.data;
		cols = other.cols;
		rows = other.rows;

		other.cols = 0;
		other.rows = 0;
		other.data = nullptr;

		return *this;
	}

	template <class Func>
	void map(Func func)
	{
		T* curP = data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] = func(curP[i]);
		}
	}

	void multiply(const Matrix<T>& other, Matrix<T>& result) const
	{
		if (cols != other.rows || result.cols != other.cols || result.rows != rows)
			throw std::runtime_error("Invalid dimentions for multiplication \n");

		for (size_t i = 0; i < rows; ++i)
		{
			T* resultRow = result.data[i], * selfRow = data[i];
			for (size_t j = 0; j < cols; ++j)
			{
				T cur = selfRow[j], * otherRow = other.data[j];
				for (size_t k = 0; k < other.cols; ++k) {
					resultRow[k] += cur * otherRow[k];
				}
			}
		}
	}
	void multiply(const std::vector<T> vec, std::vector<T>& result) const
	{
		if (cols != vec.size()) 
			throw std::runtime_error("Invalid dimentions for multiplication \n");
		
		const T* rawVec = vec.data();
		T* rawResult = result.data();

		for (size_t i = 0; i < rows; ++i)
		{
			T tmp = 0, * row = data[i];
			for (size_t j = 0; j < cols; ++j)
			{
				tmp += row[j] * rawVec[j];
			}
			rawResult[i] = tmp;
		}
	}

	void multiply_t(const std::vector<T> vec, std::vector<T>& result) const
	{
		if (rows != vec.size())
			throw std::runtime_error("Invalid dimentions for multiplication \n");

		const T* rawVec = vec.data();
		T* rawResult = result.data();

		for (size_t i = 0; i < cols; ++i)
		{
			T tmp = 0;
			for (size_t j = 0; j < rows; ++j)
			{
				tmp += data[j][i] * rawVec[j];
			}
			rawResult[i] = tmp;
		}
	}

	T& operator()(size_t i, size_t j) const { return data[i][j]; }

	Matrix& operator+=(const Matrix other)
	{
		T* curP = data[0], * otherCurP = other.data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] += otherCurP[i];
		}
		return *this;
	}
	Matrix& operator-=(const Matrix other)
	{
		T* curP = data[0], * otherCurP = other.data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] -= otherCurP[i];
		}
		return *this;
	}
	Matrix& operator/=(const T divider)
	{
		T* curP = data[0];
		for (size_t i = 0; i < rows * cols; ++i)
		{
			curP[i] /= divider;
		}
		return *this;
	}

	T*& getRow(size_t i) const { return data[i]; }

	size_t colCount() const { return cols; }
	size_t rowCount() const { return rows; }

private:
	T** data;
	size_t rows;
	size_t cols;

	void _init()
	{
		data = (T**)malloc(rows * sizeof(T*));
		data[0] = (T*)malloc(rows * cols * sizeof(T));
		T* curP = data[0];
		for (size_t r = 1; r < rows; ++r)
		{
			data[r] = (curP += cols);
		}
	}
};

template <typename T>
std::ostream& operator << (std::ostream& os, const Matrix<T>& m) {
	for (int i = 0; i < m.rowCount(); ++i) {
		T* row = m.getRow(i);
		for (int j = 0; j < m.colCount(); j++) {
			os << row[j] << " ";
		}
		os << '\n';
	}
	return os;
}