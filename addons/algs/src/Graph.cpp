#include "Graph.h"
#include <iostream>


Graph::Graph(u16 length, u16** matrix) {
	this->length = length;
	this->matrix = matrix;
	this->ways = new u16 * [length];

	for (int i = 0; i < length; ++i) {
		ways[i] = new u16[length + 1];
	}
};

void Graph::setWay(u16 index) {
	u16* way = getRandomArray(index);

	for (int i = 0; i < length; ++i) {
		ways[index][i] = way[i];
		std::cout << ways[index][i] << " ";
	}

	ways[index][length] = countWeight(way);

	std::cout << std::endl;
}

u16 Graph::getMinWeight(u16** matrix) {
	u16 min = UINT16_MAX;
	for (int i = 0; i < length; ++i) {
		u16 count = countWeight(matrix[i]);

		if (count < min) {
			min = count;
		}
	}

	return min;
}

u16 Graph::getMaxWeightIndex(u16** matrix) {
	u16 index = 0;
	u16 max = 0;

	for (int i = 0; i < length; ++i) {
		u16 count = countWeight(matrix[i]);

		if (count > max) {
			max = count;
			index = i;
		}
	}

	return index;
}

int32_t Graph::getMaxWeightIndex(u16** matrix, u16* way) {
	u16 index = 0;
	u16 max = 0;

	for (int i = 0; i < length; ++i) {
		u16 count = countWeight(matrix[i]);

		if (count > max) {
			max = count;
			index = i;
		}
	}

	u16 wayCount = countWeight(way);
	if (wayCount >= max) {
		return -1;
	}
	else {
		return index;
	}
}


u16 Graph::countWeight(u16* way) {
	u16 weight = 0;

	for (int i = 1; i < length; ++i) {
		weight += matrix[way[i - 1]][way[i]];
	}

	weight += matrix[way[length - 1]][0];
	return weight;
}