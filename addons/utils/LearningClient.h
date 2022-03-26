#pragma once
#include <thread>
#include <condition_variable>
#include <vector>
#include <mutex>
#include "DataSetStream.h"
#include "NeuralNetwork.h"

class LearningClient
{
private:
	bool run;
	std::vector<std::thread*> workers;
	std::condition_variable awakeWorkers;

	MNIST_DSStream* _stream;
	std::mutex streamMutex;

	size_t tasksDone, sampleSize;
	std::vector<Matrix<double>> resultSum;
	std::mutex outputMutex;
	std::condition_variable workDone;

	static void workerRuntime(LearningClient* client, const NeuralNetwork& net);

public:
	LearningClient(MNIST_DSStream* stream, const NeuralNetwork& net,  size_t workersCount);
	LearningClient(LearningClient&) = delete;
	LearningClient(LearningClient&&) = delete;
	~LearningClient();


	bool isDone();
	void launch(size_t sampleSize);
	void launch();
	void calcAverage();
	const Matrix<double>* getResult();
	void abort();
	void assignStream(MNIST_DSStream* stream);
};

