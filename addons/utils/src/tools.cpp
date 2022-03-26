#include "../tools.h"
#include <cmath>

const uint32_t MAX_PX_VAL = 3 * 255 * 255;

double* tools::normalizeRGBA_Img(uint8_t* imgData, size_t pxCount) {
	double* normalized = new double[pxCount];
	for (size_t i = 0; i < pxCount * 4; i += 4) {
		normalized[i / 4] = (double)((imgData[i] + imgData[i + 1] + imgData[i + 2]) * imgData[i + 3]) / MAX_PX_VAL;
	}
	return normalized;
}

Matrix<double>* tools::randWeights(const std::vector<size_t>& dimensions) {
	Matrix<double>* weights = new Matrix<double>[dimensions.size() - 1];
	for (size_t i = 0; i < dimensions.size() - 1; i++) {
		weights[i] = Matrix<double>(dimensions[i + 1], dimensions[i]);
		weights[i].forEach([](double& el) { el = (double)rand() / RAND_MAX; });
	}
	return weights;
}

double tools::sigmoid(const double& x) { return 1 / (1 + exp(-x)); }
double tools::derSig(const double& x) { return sigmoid(x) * (1 - sigmoid(x)); }
