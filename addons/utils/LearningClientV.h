#pragma once
#include <thread>
#include <condition_variable>
#include <vector>
#include <mutex>
#include <functional>

struct DataSetPackage {
	std::vector<double> data;
	uint8_t label;
};

typedef std::vector<DataSetPackage> Dataset;

template <class NeuralNetwork, typename BackpropResult>
class LearningClientV
{
private:
	typedef std::pair<
		Dataset::iterator,
		Dataset::iterator> Region;

	std::vector<std::thread*> workers;
	bool terminateFlag;
	std::vector<bool> isWorkerDone;
	std::mutex isDoneMutex;
	std::condition_variable awakeWorkers;

	Dataset* dataset;
	std::vector<Region> regions;

	BackpropResult* resultSum;
	std::mutex outputMutex;
	size_t _tasksDone;
	std::condition_variable workDone;

	static void workerRuntime(LearningClientV* client, Region& region, NeuralNetwork& net, 
		std::function<void()> callfinishCallbackback);

	//bool _isDone(std::unique_lock<std::mutex>& isDoneLock);

public:
	LearningClientV(NeuralNetwork& net, size_t workersCount);

	void launch(Dataset* dataset);
	bool isDone();
	void await();
	BackpropResult* getResult();
	size_t tasksDone();

	static Dataset download_MNIST_Dataset_MultiThread(const std::string& pathToImg,
		const std::string& pathTolabel, size_t workersCount);
};
