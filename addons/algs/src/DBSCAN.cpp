#include <list>
#include <cmath>
#include <iostream>
#include "clasterisation.h"

std::vector<uint32_t>* calcNeighborhoods(int16_t* points, uint32_t pNum, double inclusionRange) {
	std::vector<uint32_t>* neighborhoods = new std::vector<uint32_t>[pNum];

	for (uint32_t i = 0; i < pNum * 2; ++++i) {
		neighborhoods[i / 2].push_back(i / 2);
		for (uint32_t j = i + 2; j < pNum * 2; ++++j) {
			double dist = std::sqrt(std::pow(points[i] - points[j], 2) + std::pow(points[i + 1] - points[j + 1], 2));
			if (dist < inclusionRange) {
				neighborhoods[i / 2].push_back(j / 2);
				neighborhoods[j / 2].push_back(i / 2);
			}
		}
	}
	return neighborhoods;
}

uint8_t* clast::DBSCAN(int16_t* points, uint32_t pNum, double inclusionRange, uint32_t neighborhoodSize, uint8_t& clusterCount)
{
	uint8_t* clusterData = new uint8_t[pNum * 2];
	for (uint32_t i = 0; i < pNum * 2; ++i) clusterData[i] = 0;

	clusterCount = 0;

	std::vector<uint32_t>* neighborhoods = calcNeighborhoods(points, pNum, inclusionRange);

	std::list<uint32_t> unmarcked;
	for (uint32_t i = 0; i < pNum; i++) unmarcked.push_back(i);

	while (!unmarcked.empty())
	{
		uint32_t cur = unmarcked.front();
		unmarcked.pop_front();

		if (neighborhoods[cur].size() < neighborhoodSize) {
			clusterData[cur * 2 + 1] = 1;
		}
		else {
			++clusterCount;
			std::vector<uint32_t> cluster(neighborhoods[cur]);

			for (uint32_t i = 0; i < cluster.size(); ++i) {
				if (clusterData[cluster[i] * 2 + 1] < 2)
				{
					if (neighborhoods[cluster[i]].size() >= neighborhoodSize) {
						clusterData[cluster[i] * 2 + 1] = 3;
						clusterData[cluster[i] * 2] = clusterCount;
						for (uint32_t neighbor : neighborhoods[cluster[i]]) {
							if (!clusterData[neighbor * 2]) {
								cluster.push_back(neighbor);
								clusterData[neighbor * 2] = clusterCount;
							} 
						}
					} else {
						clusterData[cluster[i] * 2 + 1] = 2;
						clusterData[cluster[i] * 2] = clusterCount;
					}
				}
			}
			for (uint32_t point : cluster) {
				unmarcked.remove_if([point](uint32_t el) -> bool { return el == point; });
			}
		}
	}
	delete[] neighborhoods;
	return clusterData;
}