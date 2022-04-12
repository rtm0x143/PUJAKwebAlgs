#include <cmath>
#include "Colony.h"

double rnd01() { return (double)rand() / (RAND_MAX + 1); }

Colony::Colony(const ColonyConfig& config, double** graph, uint32_t graphSize)
	: graph(graph), graphSize(graphSize), conf(config)
{
	;
	//ants = (Ant*)malloc(sizeof(Ant) * config.antsCount);
	ants = new Ant[config.antsCount];
	for (size_t i = 0; i < config.antsCount; ++i)
	{
		ants[i] = Ant(this);
	}

	pheromones = (double**)malloc(sizeof(double*) * graphSize);
	double* pherData = (double*)malloc(sizeof(double) * graphSize * graphSize);
	pheromones[0] = pherData;
	for (size_t i = 0; i < graphSize * graphSize; ++i)
	{
		pherData[i] = 1e-100;
	}

	probabilities = (double**)malloc(sizeof(double*) * graphSize);
	probabilities[0] = (double*)malloc(sizeof(double) * graphSize * graphSize);

	for (size_t i = 1; i < graphSize; ++i)
	{
		pheromones[i] = pheromones[i - 1] + graphSize;
		probabilities[i] = probabilities[i - 1] + graphSize;
	}
}

Colony::~Colony() {
	free(pheromones[0]);
	free(probabilities[0]);
	free(pheromones);
	free(probabilities);
	delete[] ants;
}

Colony::Ant::Ant(Colony* home)
	: pathCost(0.0), home(home)/*, visited(home->graphSize), path(home->graphSize + 1)*/
{
	visited = new bool[home->graphSize];
	path = new uint16_t[home->graphSize];
}

Colony::Ant::Ant() : visited(0), path(0), home(nullptr) {};

Colony::Ant::Ant(Ant& other) : Ant(other.home)
{
	for (size_t i = 0; i < home->graphSize; i++) {
		visited[i] = other.visited[i];
	}
	for (size_t i = 0; i < home->graphSize + 1; i++) {
		path[i] = other.path[i];
	}
}
Colony::Ant::Ant(Ant&& other)
{
	home = other.home;
	visited = other.visited;
	path = other.path;

	other.home = nullptr;
	other.visited = nullptr;
	other.path = nullptr;
}

Colony::Ant& Colony::Ant::operator=(Ant& other)
{
	if (this == &other) return *this;

	home = other.home;

	if (!visited)
		visited = new bool[home->graphSize];
	if (!path)
		path = new uint16_t[home->graphSize];

	for (size_t i = 0; i < home->graphSize; i++) {
		visited[i] = other.visited[i];
	}
	for (size_t i = 0; i < home->graphSize + 1; i++) {
		path[i] = other.path[i];
	}

	return *this;
}
Colony::Ant& Colony::Ant::operator=(Ant&& other)
{
	if (this == &other) return *this;

	delete[] visited;
	delete[] path;

	home = other.home;
	visited = other.visited;
	path = other.path;

	other.home = nullptr;
	other.visited = nullptr;
	other.path = nullptr;

	return *this;
}

Colony::Ant::~Ant() {
	delete[] visited;
	delete[] path;
}

void Colony::Ant::makeTour()
{
	for (size_t i = 0; i < home->graphSize; ++i) {
		visited[i] = false;
	}

	pathCost = 0.0;
	uint32_t cur = (uint32_t)(rnd01() * home->graphSize),
		leftCount = home->graphSize;

	for (size_t i = 0; i < home->graphSize; ++i)
	{
		path[i] = cur;
		visited[cur] = true;

		double maxProb = 0.0,
			* curProbs = home->probabilities[cur];

		for (size_t j = 0; j < home->graphSize; ++j) {
			if (!visited[j]) maxProb += curProbs[j];
		}

		double prob = 0.0,
			randVal = rnd01() * maxProb;

		for (size_t j = 0; j < home->graphSize; ++j)
		{
			if (!visited[j])
			{
				prob += curProbs[j];
				if (prob >= randVal) {
					pathCost += home->graph[cur][j];
					cur = j;
					break;
				}
			}
		}
	}
	path[home->graphSize] = path[0];
	pathCost += home->graph[path[home->graphSize]][path[0]];
}

void Colony::Ant::releasePheromones()
{
	for (size_t i = 1; i < home->graphSize + 1; ++i) {
		home->pheromones[path[i - 1]][path[i]] += 1 / pathCost;
	}
}

void Colony::calcProbabilities()
{
	double* prefs = (double*)malloc(sizeof(double) * graphSize);
	for (size_t i = 0; i < graphSize; ++i)
	{
		double prefsSum = 0.0,
			* graphNode = graph[i],
			* pherNone = pheromones[i],
			* probNode = probabilities[i];

		for (size_t j = 0; j < graphSize; ++j)
		{
			if (i == j) continue;
			prefs[j] = std::pow(1.0 / graphNode[j], conf.greedCoef) * std::pow(pherNone[j], conf.herdCoef);
			prefsSum += prefs[j];
		}

		for (size_t j = 0; j < graphSize; ++j)
		{
			probNode[j] = prefs[j] / prefsSum;
		}
	}

	free(prefs);
}

void Colony::leakPheromones()
{
	for (size_t i = 0; i < graphSize; ++i)
	{
		double* pherNode = pheromones[i];
		for (size_t j = 0; j < graphSize; ++j) {
			pherNode[j] *= conf.pherLeak;
		}
	}
}

std::pair<std::vector<uint16_t>, double>* Colony::iterate()
{
	calcProbabilities();

	for (size_t i = 0; i < conf.antsCount; ++i) {
		ants[i].makeTour();
	}

	for (size_t i = 0; i < conf.antsCount; ++i) {
		ants[i].releasePheromones();
	}

	leakPheromones();

	uint32_t bestInd = 0;
	for (size_t i = 1; i < conf.antsCount; ++i) {
		if (ants[bestInd].pathCost > ants[i].pathCost) bestInd = i;
	}

	uint16_t* bestPath = ants[bestInd].path;
	auto result = new std::pair<std::vector<uint16_t>, double>{ 
		std::vector<uint16_t>(graphSize + 1), ants[bestInd].pathCost };

	for (size_t i = 0; i < graphSize + 1; i++) {
		result->first[i] = bestPath[i];
	}

	return result;
}

std::pair<std::vector<uint16_t>, double>* Colony::operator()() {
	return iterate();
}