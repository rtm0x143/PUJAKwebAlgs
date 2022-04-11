#pragma once
#include <thread>
#include <mutex>
#include <condition_variable>
#include "Colony.h"

class AntsRuntime
{
public:
	AntsRuntime();
	~AntsRuntime();
	
	uint64_t launch(const ColonyConfig& colonySettings, uint16_t* points, uint32_t pCount);
	bool hasSession(const uint64_t& id);
	std::pair<std::vector<uint16_t>, double> getEpochResult(const uint64_t& id);
	void terminate(const uint64_t& id);

private:
	struct Session
	{
		uint64_t id;
		Colony* colony;
		std::pair<std::vector<uint16_t>, double> result;
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

