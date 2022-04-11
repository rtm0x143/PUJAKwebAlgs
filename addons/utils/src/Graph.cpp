#include "../Graph.h"
#include <iostream>


Graph::Graph(u16 length, double** matrix) : ways(length) {
	this->length = length;
	this->matrix = matrix;

	for (Way& way : ways) {
		way.path = new u16[length];
		way.weight = 0.0;
		setRandomWay(way);
	}
};

Graph::~Graph()
{
	for (Way& way : ways) {
		delete way.path;
	}
	
}

//create random way on Graph
void Graph::setRandomWay(Way& way) {
	bool* visits = new bool[length];

	for (int i = 0; i < length; ++i) {
		visits[i] = false;
	}

	u16 counter = 0;
	while (counter < length) {
		u16 prob = rand() % length;

		if (!visits[prob]) {
			visits[prob] = true;
			way.path[counter] = prob;
			++counter;
		}
	};

	countWeight(way);
	delete[] visits;
}

Graph::Way& Graph::getMinWay()
{
	Way& minWay = ways.front();
	for (int i = 1; i < length; ++i) {
		if (ways[i].weight < minWay.weight) {
			minWay = ways[i];
		}
	}

	return minWay;
}

//u16 Graph::getMinWeight(double** matrix) {
//	u16 min = UINT16_MAX;
//	for (int i = 0; i < length; ++i) {
//		u16 count = countWeight(matrix[i]);
//
//		if (count < min) {
//			min = count;
//		}
//	}
//
//	return min;
//}
//
//u16 Graph::getMaxWeightIndex(double** matrix) {
//	u16 index = 0;
//	u16 max = 0;
//
//	for (int i = 0; i < length; ++i) {
//		u16 count = countWeight(matrix[i]);
//
//		if (count > max) {
//			max = count;
//			index = i;
//		}
//	}
//
//	return index;
//}
//
//int32_t Graph::getMaxWeightIndex(double** matrix, u16* way) {
//	u16 index = 0;
//	u16 max = 0;
//
//	for (int i = 0; i < length; ++i) {
//		u16 count = countWeight(matrix[i]);
//
//		if (count > max) {
//			max = count;
//			index = i;
//		}
//	}
//
//	u16 wayCount = countWeight(way);
//	if (wayCount >= max) {
//		return -1;
//	}
//	else {
//		return index;
//	}
//}

void Graph::countWeight(Way& way) {
	u16* path = way.path;
	way.weight = 0.0;

	for (int i = 1; i < length; ++i) {
		way.weight += matrix[path[i - 1]][path[i]];
	}

	way.weight += matrix[path[length - 1]][0];
}