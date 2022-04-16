#include "../Genetic.h"
#include <iostream>
#include <algorithm>

Genetic::Genetic(Graph* graph) : graph(graph), bestWay(nullptr) {}

void Genetic::crossChromo(u16 firstChromo, u16 secondChromo, u16* splitPath) {
	u16 start = rand() % (graph->length - 1) + 1;
	u16 end = rand() % (graph->length - start) + start + 1;

	while (start == end) {
		end = rand() % (graph->length - start) + start + 1;
	}

	for (int i = start; i < end; ++i) {
		splitPath[i - start] = graph->ways[firstChromo].path[i]; 
	}

	u16 index = end - start;
	bool flag = true;
	for (int i = 0; i < graph->length; ++i) {
		for (int j = 0; j < end - start; ++j) {
			if (splitPath[j] == graph->ways[secondChromo].path[i]) {
				flag = false;
				break;
			}
		}

		if (flag) {
			splitPath[index] = graph->ways[secondChromo].path[i];
			++index;
			++end;
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

void Genetic::generate() {
	for (size_t i = 0; i < graph->lengthCube; ++i) {
		//u16* splitPath = new u16[graph->length];
		u16* splitPath = (u16*)malloc(graph->length * 2);

		u16 firstChromo = rand() % (graph->length * graph->length);
		u16 secondChromo = rand() % (graph->length * graph->length);

		while (secondChromo == firstChromo) {
			secondChromo = rand() % (graph->length * graph->length);
		}

		crossChromo(firstChromo, secondChromo, splitPath);
		
		if (rand() % 100 <= 50) {
			mutation(splitPath);
		}

		if (rand() % 100 <= 30) {
			mutation(splitPath);
			mutation(splitPath);
		}

		if (rand() % 100 <= 20) {
			mutation(splitPath);
			mutation(splitPath);
			mutation(splitPath);
		}


		if (rand() % 100 <= 10) {
			reverseMutation(splitPath);
		}

		Graph::Way firstSplitWay{ splitPath };

		graph->countWeight(firstSplitWay);
		graph->ways.push_back(firstSplitWay);
	}

	std::sort(graph->ways.begin(), graph->ways.end(), 
		[](Graph::Way& v1, Graph::Way& v2) { return v1.weight < v2.weight; });

	//std::cout << (*graph->ways.begin()).weight << std::endl;

	for (size_t i = graph->lengthCube; i < graph->lengthCube * 2; i++) {
		free(graph->ways[i].path);
	}
	graph->ways.resize(graph->lengthCube);
};

std::pair<std::vector<u16>, double>* Genetic::operator()()
{
	for (size_t i = 0; i < 10; ++i) {
		generate();
	}

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