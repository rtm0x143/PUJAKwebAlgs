#include "../clasterisation.h"
#include <ctime>
#include <iostream>

double k_means_run(const std::vector<double*>& objs, int paramCount,
	double(*metricsFun)(double* obj1, double* obj2, int paramCount), uint8_t* clasterisation, uint8_t clasterCount)
{
	clasterCount = std::min(objs.size(), (size_t)clasterCount);
	// generate random cluster's centers
	double** centers = (double**)malloc(clasterCount * sizeof(double*)),
		* centers_data = (double*)malloc(clasterCount * 2 * sizeof(double)),
		** newCenters = (double**)malloc(clasterCount * sizeof(double*)),
		* newCenters_data = (double*)malloc(clasterCount * 2 * sizeof(double));

	for (size_t i = 0; i < clasterCount * 2; ++i) {
		centers_data[i] = (double)rand() / RAND_MAX;
	}
	centers[0] = centers_data;
	newCenters[0] = newCenters_data;

	for (uint8_t i = 1; i < clasterCount; ++i) {
		centers[i] = centers[i - 1] + paramCount;
		newCenters[i] = newCenters[i - 1] + paramCount;
	}

	std::vector<double> distances(objs.size());
	std::vector<int> clasterSizes(clasterCount);

	while (true)
	{
		// refind clusters
		for (int i = 0; i < objs.size(); ++i)
		{
			distances[i] = metricsFun(objs[i], centers[0], paramCount);
			clasterisation[i] = 0;
			for (uint8_t c = 1; c < clasterCount; ++c) {
				double dist = metricsFun(objs[i], centers[c], paramCount);
				if (distances[i] > dist) {
					distances[i] = dist;
					clasterisation[i] = c;
				}
			}
		}
		clasterSizes.assign(clasterCount, 0);
		for (int i = 0; i < objs.size(); ++i) {
			++clasterSizes[clasterisation[i]];
		}
		
		//		correct center's positions
		for (size_t i = 0; i < clasterCount * 2; ++i) {
			newCenters_data[i] = clasterSizes[i / 2] ? 0.0 : (double)rand() / RAND_MAX;
		}

		// centralization
		for (int i = 0; i < objs.size(); ++i) {
			for (int p = 0; p < paramCount; ++p)
				newCenters[clasterisation[i]][p] += objs[i][p];
		}
		for (uint8_t i = 0; i < clasterCount; ++i) {
			for (int p = 0; p < paramCount; ++p)
				newCenters[i][p] /= (clasterSizes[i] ? clasterSizes[i] : 1);
		}
		// check for changes
		bool changed = false;
		for (uint8_t i = 0; i < clasterCount; ++i) 
		{
			double* newCenter = newCenters[i],
				* oldCenter = centers[i];

			for (int p = 0; p < paramCount; ++p)
				if (std::abs(newCenter[p] - oldCenter[p]) > 1e-4) {
					changed = true;
					break;
				}
		}

		if (changed) {
			for (uint8_t i = 0; i < clasterCount * 2; ++i)
				centers_data[i] = newCenters_data[i];
		}
		else {
			double error = 0;
			for (double dist : distances) error += dist;

			free(centers_data);
			free(centers);
			free(newCenters_data);
			free(newCenters);
			return error;
		}
	}
}

uint8_t* clast::k_means(const std::vector<double*>& objs, int paramCount,
	double(*metricsFun)(double* obj1, double* obj2, int paramCount), uint8_t& clasterCount, bool findClasterCount)
{
	srand(time(0));
	uint8_t* result = new uint8_t[objs.size()];
	if (findClasterCount)
	{
		uint8_t* newResult = new uint8_t[objs.size()];
		clasterCount = 1;
		double error = k_means_run(objs, paramCount, metricsFun, result, clasterCount);
		bool run = true;
		while (run && clasterCount <= 10)
		{
			double newError = k_means_run(objs, paramCount, metricsFun, newResult, clasterCount + 1);

			// std::cout << (int)clasterCount << " : " << error << " ; " << clasterCount + 1 << " : " << newError << '\n';
			// std::cout << '\t' << (double)(clasterCount + 1) / clasterCount << ' ' << error / newError << '\n';

			if (newError) {
				if (newError >= error) continue;
				if ((double)(clasterCount + 1) / clasterCount > error / newError) break;
			} else {
				run = false;
			}

			error = newError;
			std::swap(result, newResult);
			++clasterCount;
		}
		delete[] newResult;
	}
	else {
		k_means_run(objs, paramCount, metricsFun, result, clasterCount);
	}
	return result;
}