#include "metrics.h"
#include <string>

double metrics::Euclidean(double* obj1, double* obj2, int paramCount) {
	double result = 0;
	for (int i = 0; i < paramCount; i++) {
		result += (obj1[i] - obj2[i]) * (obj1[i] - obj2[i]);
	}
	return std::sqrt(result);
}

double metrics::EuclideanCubes(double* obj1, double* obj2, int paramCount) {
	double result = 0;
	for (int i = 0; i < paramCount; i++) {
		result += (obj1[i] - obj2[i]) * (obj1[i] - obj2[i]);
	}
	return result;
}

double metrics::Chebyshev(double* obj1, double* obj2, int paramCount) {
	double result = 0;
	for (int i = 0; i < paramCount; i++) {
		double diff = std::abs(obj1[i] - obj2[i]);
		if (diff > result) result = diff;
	}
	return result;
}

double metrics::Manhattan(double* obj1, double* obj2, int paramCount) {
	double result = 0;
	for (int i = 0; i < paramCount; i++) {
		result += std::abs(obj1[i] - obj2[i]);
	}
	return result;
}

double(*metrics::metricFromName(const std::string& name))(double* obj1, double* obj2, int paramCount)
{
	if (name == "Euclidean") {
		return metrics::Euclidean;
	} else if (name == "EuclideanCubes") {
		return metrics::EuclideanCubes;
	} else if (name == "Manhattan") {
		return metrics::Manhattan;
	} else if (name == "Chebyshev") {
		return metrics::Chebyshev;
	} else {
		throw "Invalid metric name";
	}
}