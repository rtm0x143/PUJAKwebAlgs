#include <iostream>
#include <ctime>
#include "Genetic.h"
#include "Graph.h"
#include "sort.h"

int main()
{
	srand((unsigned int)time(0));

	///matrix uint16 need to get from web site
	uint16_t length = 10;

	uint16_t** matrix = new uint16_t *[length];

	for (int i = 0; i < length; ++i) {
		matrix[i] = new uint16_t[length];

		for (int j = 0; j < length; ++j) {
			if (i != j) {
				matrix[i][j] = rand() % length + 1;
			}
			else {
				matrix[i][j] = 0;
			}
		}
	}

	for (int i = 0; i < length; ++i) {
		for (int j = 0; j < length; ++j) {
			std::cout << matrix[i][j] << " ";
		}

		std::cout << std::endl;
	}

	std::cout << std::endl;

	Graph *graph = new Graph(length, matrix);

	for (int i = 0; i < length; ++i) {
		graph->setWay(i);
	}

	Genetic* genetic = new Genetic(graph);
	std::cout << std::endl;

	for (int i = 0; i < 100; ++i) {
		genetic->generate();
		genetic->printData();
		std::cout << std::endl;
	}

	std::cout << std::endl;

	std::cout << genetic->minWeight << std::endl;

	//genetic->printData();

	delete[] matrix;
	delete graph;
}