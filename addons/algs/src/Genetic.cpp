#include "Genetic.h"
#include "sort.h"
#include <iostream>

Genetic::Genetic(Graph* graph) {
	this->graph = graph;
	this->minWeight = UINT16_MAX;
	this->length = graph->length;
	this->population = graph->ways;
}

void Genetic::crossChromo(u16 splitPoint, u16 firstChromo, u16 secondChromo, u16* splitWay) {
	//crossing
	for (int i = 0; i < splitPoint; ++i) {
		splitWay[i] = this->population[firstChromo][i]; 
	}

	bool flag = true;
	u16 cashedSplitLength = splitPoint;
	for (int i = splitPoint; i < length; ++i) {
		for (int j = 0; j < splitPoint; ++j) {
			if (splitWay[j] == this->population[secondChromo][i]) {
				flag = false;
				break;
			}
		}

		if (flag == true) {
			splitWay[splitPoint] = this->population[secondChromo][i];
			++splitPoint;
		}

		flag = true;
	}

	for (int i = cashedSplitLength; i < length; ++i) {
		for (int j = 0; j < splitPoint; ++j) {
			if (splitWay[j] == this->population[firstChromo][i]) {
				flag = false;
				break;
			}
		}

		if (flag == true) {
			splitWay[splitPoint] = this->population[firstChromo][i];
			++splitPoint;
		}

		flag = true;
	}
}

void Genetic::mutation(u16* splitWay) {
	u16 firstIndex = rand() % length;
	u16 secondIndex = rand() % length;

	while (secondIndex == firstIndex) {
		secondIndex = rand() % length;
	}

	std::swap(splitWay[firstIndex], splitWay[secondIndex]);
}

void Genetic::reverseMutation(u16* splitWay) 
{
	for (size_t i = 0; i < length / 2; ++i) {
		std::swap(splitWay[i], splitWay[length - i - 1]);
	}
}

void Genetic::updatePopulation(u16* way) {
	//sort matrix
	int32_t index =  graph->getMaxWeightIndex(population, way);

	std:: cout << index << std::endl;
	
	//delete population if its longer
	
	
	if (index >= 0) {
		delete[] population[index];

		population[index] = way;
	}

	/*if (way[length] < population[length - 1][length]) {
		delete[] population[length - 1];

		population[length - 1] = way;
	}*/
}

void Genetic::generate() {
	u16* firstSplitWay = new u16[length + 1];
	u16* secondSplitWay = new u16[length + 1];

	u16 firstChromo = rand() % length;
	u16 secondChromo = rand() % length;

	while (secondChromo == firstChromo) {
		secondChromo = rand() % length;
	}

	u16 splitPoint = (rand() % (length - 2)) + 1;

	std::cout << firstChromo << std::endl;
	std::cout << secondChromo << std::endl;
	std::cout << splitPoint << std::endl;

	crossChromo(splitPoint, firstChromo, secondChromo, firstSplitWay);
	crossChromo(splitPoint, secondChromo, firstChromo, secondSplitWay);

	for (int i = 0; i < length; ++i) {
		std::cout << firstSplitWay[i] << " ";
	}

	std::cout << std::endl;

	for (int i = 0; i < length; ++i) {
		std::cout << secondSplitWay[i] << " ";
	}

	std::cout << std::endl;


	if (rand() % 100 <= 50) {
		mutation(firstSplitWay);
	}

	if (rand() % 100 <= 50) {
		mutation(secondSplitWay);
	}

	if (rand() % 100 <= 5) {
		reverseMutation(firstSplitWay);
	}

	if (rand() % 100 <= 5) {
		reverseMutation(secondSplitWay);
	}

	firstSplitWay[length] = graph->countWeight(firstSplitWay);
	secondSplitWay[length] = graph->countWeight(secondSplitWay);

	updatePopulation(firstSplitWay);
	updatePopulation(secondSplitWay);

	minWeight = graph->getMinWeight(population);
};

void Genetic::printData() {
	for (int i = 0; i < length; ++i) {
		for (int j = 0; j < length; ++j) {
			std::cout << population[i][j] << " ";
		}

		std::cout << std::endl;
	}
}