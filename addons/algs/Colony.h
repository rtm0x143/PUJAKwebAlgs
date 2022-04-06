#pragma once
#include <cstdint>
#include <vector>
#include <cstdlib>
#include <utility>

struct ColonyConfig 
{
	uint32_t antsCount;
	double greedCoef;
	double herdCoef;
	double pherLeak;
};

class Colony
{
public:
	Colony(const ColonyConfig& config, double** graph, uint32_t graphSize);
	~Colony();

	class Ant
	{
	public:
		Ant();
		Ant(Colony* home);
		Ant(Ant&);
		Ant(Ant&&);
		~Ant();
		
		Ant& operator=(Ant& other);
		Ant& operator=(Ant&& other);
		

		void makeTour();
		void releasePheromones();

		uint16_t* path;
		//std::vector<uint16_t> path;
		double pathCost;

	private:
		bool* visited;
		//std::vector<bool> visited;
		Colony* home;
	};

	std::pair<uint16_t*, double> iterate();

private:
	double** graph;
	double** pheromones;
	double** probabilities;
	uint32_t graphSize;

	Ant* ants;
	ColonyConfig conf;

	void calcProbabilities();
	void leakPheromones();
};
