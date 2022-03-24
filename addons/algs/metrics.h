#pragma once
#include <cmath>
#include <string>

// double(*metricsFun)(int16_t* points, uint8_t clasterisation, uint32_t pNum, int16_t* clusterCenters, uint32_t clusterCount)

// gets arrays of normalised parameters 

namespace metrics
{
	double(*metricFromName(const std::string& name))(double* obj1, double* obj2, int paramCount);

	double Euclidean(double* obj1, double* obj2, int paramCount);

	double EuclideanCubes(double* obj1, double* obj2, int paramCount);

	double Chebyshev(double* obj1, double* obj2, int paramCount);

	double Manhattan(double* obj1, double* obj2, int paramCount);
}