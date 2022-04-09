#pragma once
#include <vector>
#include "Graph.h"

typedef uint16_t u16;

class Genetic
{
public:
	Genetic(Graph* graph);

	void printData();

	std::pair<std::vector<u16>, double>* operator()();

private:
	Graph* graph;
	Graph::Way* bestWay;
	//u16 length;
	//std::vector<Graph::Way> population;

	void generate();
	void crossChromo(u16 splitPoint, u16 firstChromo, u16 secondChromo, u16* splitWay);
	void mutation(u16* splitPath);
	void reverseMutation(u16* splitPath);
	bool updatePopulation(Graph::Way& way);
};