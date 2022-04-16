#include "../Graph.h"
#include <iostream>


Graph::Graph(u16 length, double** matrix) : ways(length * length) {
	this->length = length;
	this->matrix = matrix;
	this->lengthCube = length * length;

	//ways_data = (u16*)malloc(2 * lengthCube);

	for (Way& way : ways) {
		way.path = (u16*)malloc(2 * length);
		way.weight = 0.0;
		setRandomWay(way);
	}
};

Graph::~Graph()
{
	for (Way& way : ways) {
		free(way.path);
	}
	//free(ways_data);
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

void Graph::countWeight(Way& way) {
	u16* path = way.path;
	way.weight = 0.0;

	for (int i = 1; i < length; ++i) {
		way.weight += matrix[path[i - 1]][path[i]];
	}

	way.weight += matrix[path[length - 1]][0];
}