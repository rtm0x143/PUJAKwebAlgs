#pragma once
#include <vector>
#include "metrics.h"

namespace clast
{
	/*
	*	"Density-based spatial clustering of applications with noise"
	*
	* Input is uint16_t array, where : a[i] - y, a[i+1] - x (for each i = [0,size))
	* Output is uint8_t array, where : a[i] - cluster number, a[i+1] - point type (for each i = [0,size))
	* point type encoding : { 1: noise, 2: frontier, 3: interior }
	* 	only for canvas
	*/
	uint8_t* DBSCAN(int16_t* points, uint32_t pNum, 
		double inclusionRange, uint32_t neighborhoodSize, uint8_t& clusterCount);

	/*
	* Output is uint8_t array, where a[i] - cluster number
	*/
	uint8_t* k_means(const std::vector<double*>& objs, int paramCount,
		double(*metricsFun)(double* obj1, double* obj2, int paramCount),
		uint8_t& clusterCount, bool findClusterCount = false);
}
