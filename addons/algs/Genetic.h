#pragma once
#include <vector>
#include "Graph.h"

typedef uint16_t u16;

class Genetic
{
public:
	u16 minWeight;
	Genetic(Graph* graph);

	void generate();
	void printData();

private:
	Graph* graph;
	u16 length;
	u16** population;
	
	void crossChromo(u16 splitPoint, u16 firstChromo, u16 secondChromo, u16* splitWay);
	void mutation(u16* splitWay);
	void reverseMutation(u16* splitWay);
	void updatePopulation(u16* way);
};