#pragma once
#include <thread>
#include <condition_variable>
#include <vector>
#include <mutex>
#include "../algs/NeuralNetwork.h"
#include "C:\Users\russi\source\repos\NetDev\LearningClientV.h"

class LearningClient
{
private:
	bool run, terminateFlag;
	std::vector<std::thread*> workers;
	std::vector<uint8_t> workerStatuses; // 1 - running, 2 - waiting, 3 - terminated
	std::mutex callbackMutex;
	std::condition_variable awakeWorkers;

	typedef std::pair<
		Dataset::iterator,
		Dataset::iterator> Region;

	Dataset& dataset;
	std::vector<Region> regions;

	size_t _tasksDone, layCount;
	NeuralNetwork::backPropagation_Result resultSum;
	std::mutex outputMutex;
	std::condition_variable workDone;

	static void workerFinishReport(LearningClient* client, const  std::thread::id& workerId);

	static void workerRuntime(LearningClient* client, Region& region, 
		NeuralNetwork& net);

public:
	LearningClient(Dataset& dataset, NeuralNetwork& net, size_t workersCount);
	LearningClient(LearningClient&) = delete;
	LearningClient(LearningClient&&) = delete;
	~LearningClient();


	bool isDone();
	void launch();
	void doDescent(Matrix<double>* weights, std::vector<double>* biases, double descentCoef = 1);
	void abort();
	void await();
};
