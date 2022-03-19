#include "clasterisation.h"
#include <ctime>
#include <iostream>

double k_means_run(const std::vector<double*>& objs, int paramCount,
	double(*metricsFun)(double* obj1, double* obj2, int paramCount), uint8_t* clasterisation, uint8_t clasterCount)
{
	// generate random cluster's centers
	std::vector<double*> centers(clasterCount);
	for (uint8_t i = 0; i < clasterCount; i++) {
		double* center = new double[paramCount];
		for (int i = 0; i < paramCount; i++) center[i] = (double)rand() / RAND_MAX;
		centers[i] = center;
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
			for (uint8_t c = 1; c < centers.size(); ++c) {
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
		// create new centers
		std::vector<double*> newCenters(clasterCount);
		for (uint8_t i = 0; i < clasterCount; i++) {
			double* center = new double[paramCount];
			for (int p = 0; p < paramCount; p++) center[p] = 0;
			newCenters[i] = center;
		}
		// centralization
		for (int i = 0; i < objs.size(); i++) {
			for (int p = 0; p < paramCount; ++p)
				newCenters[clasterisation[i]][p] += objs[i][p];
		}
		for (uint8_t i = 0; i < clasterCount; i++) {
			for (int p = 0; p < paramCount; ++p)
				newCenters[i][p] /= clasterSizes[i] ? clasterSizes[i] : 1;
		}
		// check for changes
		bool changed = false;
		for (uint8_t i = 0; i < clasterCount; ++i) {
			for (int p = 0; p < paramCount; p++)
				if (std::abs(newCenters[i][p] - centers[i][p]) > 1e-4) {
					changed = true;
					break;
				}
		}

		for (uint8_t i = 0; i < clasterCount; ++i) delete[] centers[i];

		if (changed) {
			for (uint8_t i = 0; i < clasterCount; ++i)
				centers[i] = newCenters[i];
		}
		else {
			for (uint8_t i = 0; i < clasterCount; ++i) delete[] newCenters[i];
			double error = 0;
			for (double dist : distances) error += dist;

			return error;
		}
	}
}

uint8_t* clast::k_means(const std::vector<double*>& objs, int paramCount,
	double(*metricsFun)(double* obj1, double* obj2, int paramCount), uint8_t& clasterCount, bool findClasterCount)
{
	srand(time(0));
	uint8_t* clasterisationResult = new uint8_t[objs.size()];
	if (findClasterCount)
	{
		clasterCount = 1;
		double error = k_means_run(objs, paramCount, metricsFun, clasterisationResult, clasterCount);
		while (true)
		{
			double newError = k_means_run(objs, paramCount, metricsFun, clasterisationResult, clasterCount + 1);
			// std::cout << (int)clasterCount << " : " << error << " ; " << clasterCount + 1 << " : " << newError << '\n';
			// std::cout << '\t' << (double)(clasterCount + 1) / clasterCount << ' ' << error / newError << '\n';
			if ((double)(clasterCount + 1) / clasterCount > error / newError) break;
			error = newError;
			++clasterCount;
			if (clasterCount == 11) break;
		}
	}
	else {
		k_means_run(objs, paramCount, metricsFun, clasterisationResult, clasterCount);
	}
	return clasterisationResult;
}