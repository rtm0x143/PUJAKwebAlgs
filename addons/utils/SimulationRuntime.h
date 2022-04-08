#pragma once
#include <thread>
#include <mutex>
#include <condition_variable>
#include "Colony.h"

template <class Simulation, class State>
class SimulationRuntime
{
public:
	SimulationRuntime();
	~SimulationRuntime();

	uint64_t attach(Simulation* sim);
	Simulation* hasSession(const uint64_t& id);
	State getEpochResult(const uint64_t& id);
	Simulation* detach(const uint64_t& id);

private:
	struct Session
	{
		uint64_t id;
		Simulation* sim;
		State result;
		std::mutex* _mutex;
	};

	std::vector<Session*> sessions;

	std::vector<Session*> tasks;
	std::condition_variable tasksUpdated;
	std::condition_variable tasksDone;
	std::mutex tasksMutex;

	std::thread worker;
	bool terminateFlag;

	static void workerRuntime(
		bool* terminate,
		std::condition_variable* queueUpdated,
		std::vector<Session*>* tasksQueue,
		std::mutex* queueMutex,
		std::condition_variable* tasksDone);

	uint64_t idCounter = 0;
};

