#include "../Genetic.h"
#include "../sort.h"
#include <iostream>

Genetic::Genetic(Graph* graph) : graph(graph), bestWay(nullptr)
{
	//this->length = graph->length;
	//graph->ways = graph->ways;
}

void Genetic::crossChromo(u16 splitPoint, u16 firstChromo, u16 secondChromo, u16* splitPath) {
	//crossing
	for (int i = 0; i < splitPoint; ++i) {
		splitPath[i] = graph->ways[firstChromo].path[i]; 
	}

	bool flag = true;
	u16 cashedSplitLength = splitPoint;
	for (int i = 0; i < graph->length; ++i) {
		for (int j = 0; j < splitPoint; ++j) {
			if (splitPath[j] == graph->ways[secondChromo].path[i]) {
				flag = false;
				break;
			}
		}

		if (flag) {
			splitPath[splitPoint] = graph->ways[secondChromo].path[i];
			++splitPoint;
		}

		flag = true;
	}

}

void Genetic::mutation(u16* splitPath) {
	u16 firstIndex = rand() % graph->length;
	u16 secondIndex = rand() % graph->length;

	while (secondIndex == firstIndex) {
		secondIndex = rand() % graph->length;
	}

	std::swap(splitPath[firstIndex], splitPath[secondIndex]);
}

void Genetic::reverseMutation(u16* splitPath)
{
	for (size_t i = 0; i < graph->length / 2; ++i) {
		std::swap(splitPath[i], splitPath[graph->length - i - 1]);
	}
}

bool Genetic::updatePopulation(Graph::Way& way) {
	//sort matrix
	Graph::Way& minWay =  graph->getMinWay();
	
	//delete population if its longer
	if (way.weight < minWay.weight) {
		delete[] minWay.path;
		minWay = way;

		return true;
	}
	return false;

	/*if (way[length] < population[length - 1][length]) {
		delete[] population[length - 1];

		population[length - 1] = way;
	}*/
}

void Genetic::generate() {
	u16* firstSplitPath = new u16[graph->length];
	u16* secondSplitPath = new u16[graph->length];

	u16 firstChromo = rand() % graph->length;
	u16 secondChromo = rand() % graph->length;

	while (secondChromo == firstChromo) {
		secondChromo = rand() % graph->length;
	}

	u16 splitPoint = (rand() % (graph->length - 2)) + 1;

	std::cout << firstChromo << std::endl;
	std::cout << secondChromo << std::endl;
	std::cout << splitPoint << std::endl;

	crossChromo(splitPoint, firstChromo, secondChromo, firstSplitPath);
	crossChromo(splitPoint, secondChromo, firstChromo, secondSplitPath);

	for (int i = 0; i < graph->length; ++i) {
		std::cout << firstSplitPath[i] << " ";
	}

	std::cout << std::endl;

	for (int i = 0; i < graph->length; ++i) {
		std::cout << secondSplitPath[i] << " ";
	}

	std::cout << std::endl;


	if (rand() % 100 <= 50) {
		mutation(firstSplitPath);
	}

	if (rand() % 100 <= 50) {
		mutation(secondSplitPath);
	}

	if (rand() % 100 <= 5) {
		reverseMutation(firstSplitPath);
	}

	if (rand() % 100 <= 5) {
		reverseMutation(secondSplitPath);
	}

	Graph::Way firstSplitWay{ firstSplitPath };
	Graph::Way secondSplitWay{ secondSplitPath };

	graph->countWeight(firstSplitWay);
	graph->countWeight(secondSplitWay);

	if (!updatePopulation(firstSplitWay)) delete[] firstSplitPath;
	if (!updatePopulation(secondSplitWay)) delete[] secondSplitPath;
};

std::pair<std::vector<u16>, double>* Genetic::operator()()
{
	generate();
	Graph::Way& minWay = graph->getMinWay();
	std::pair<std::vector<u16>, double>* epochResult =
		new std::pair<std::vector<u16>, double>{ std::vector<u16>(graph->length + 1), minWay.weight };

	u16* p_path = epochResult->first.data();
	for (size_t i = 0; i < graph->length; ++i) {
		p_path[i] = minWay.path[i];
	}
	p_path[graph->length] = p_path[0];

	return epochResult;
}

void Genetic::printData() {
	for (int i = 0; i < graph->length; ++i) {
		for (int j = 0; j < graph->length; ++j) {
			std::cout << graph->ways[i].path[j] << ' ';
		}

		std::cout << std::endl;
	}
}