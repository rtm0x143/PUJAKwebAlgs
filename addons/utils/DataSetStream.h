#pragma once
#include <fstream>
#include <vector>
#include <thread>
#include <condition_variable>

class DataSetStream
{
public:
	virtual struct Package {};

	virtual Package* nextPackage();
	bool isEnded();
	size_t size();

	DataSetStream(size_t packageCount);

protected:
	size_t _packageLeft;

	virtual Package* _read();
};

class DataSetStream_Async : public DataSetStream
{
public:
	virtual Package* nextPackage();
	bool isEnded();
	size_t size();

	DataSetStream_Async(size_t packageCount, size_t bufferSize);
	~DataSetStream_Async();

protected:
	std::vector<Package*> _buffer;
	std::thread _reader;
	std::vector<Package*>::iterator _bufWriteIt;
	std::condition_variable _awakeReader;
	std::condition_variable _releaseData;
	bool _readerRun;

	static void _readerRuntime(DataSetStream_Async* bond);
};

// Then you create your stream implementation; with overriding "_read" method and Package structer
// For Example
class MNIST_DSStream : public DataSetStream {
public:
	MNIST_DSStream(const std::string& pathToImg, const std::string& pathTolabel, size_t bufferSize);
	~MNIST_DSStream();

	struct Package : DataSetStream::Package {
		std::vector<double> data;
		uint8_t label;

		Package(size_t size, uint8_t label);
		Package(Package&& other) = default;
	};

	Package* nextPackage();

private:
	Package* _read();

	std::ifstream _istream;
	std::ifstream _lstream;
	size_t _imgSize;
};

