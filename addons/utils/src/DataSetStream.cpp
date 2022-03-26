#include "../DataSetStream.h"

DataSetStream::DataSetStream(size_t packageCount) {
	_packageLeft = packageCount;
}

DataSetStream::Package* DataSetStream::nextPackage() {
	Package* package = _read();
	--_packageLeft;
	return package;
}

bool DataSetStream::isEnded() { return _packageLeft == 0; }
size_t DataSetStream::size() { return _packageLeft; }

DataSetStream::Package* DataSetStream::_read() {
	throw "_read method must be overriden in child classes";
	return NULL;
}

DataSetStream_Async::DataSetStream_Async(size_t packageCount, size_t bufferSize) 
	: DataSetStream(packageCount)
{
	_buffer.assign(bufferSize, nullptr);
	_readerRun = true;
	_reader = std::thread(_readerRuntime, this);
	_awakeReader.notify_one();
}

DataSetStream_Async::~DataSetStream_Async() {
	_readerRun = false;
	_awakeReader.notify_one();
	if (_reader.joinable()) _reader.join();

	for (Package* pack : _buffer) delete pack;
}

bool DataSetStream_Async::isEnded() {
	for (Package* pack : _buffer) {
		if (pack != nullptr) return false;
	}
	if (_packageLeft) return false;
	return true;
}

size_t DataSetStream_Async::size() { 
	return _packageLeft + _buffer.size() -
		std::count(_buffer.begin(), _buffer.end(), nullptr);
}

DataSetStream::Package* DataSetStream_Async::nextPackage() 
{
	std::vector<Package*>::iterator bufReadIt = _buffer.begin();
	std::mutex self_lock;
	std::unique_lock<std::mutex> locker(self_lock);

	while (*bufReadIt == nullptr || bufReadIt == _bufWriteIt)
	{
		if (++bufReadIt == _buffer.end()) 
		{
			if (!_packageLeft) throw "Stream already wasted";
			_awakeReader.notify_one();
			_releaseData.wait(locker);
			bufReadIt = _buffer.begin();
		}
	}
	Package* package = *bufReadIt;
	*bufReadIt = nullptr;
	_awakeReader.notify_one();
	return package;
}

void DataSetStream_Async::_readerRuntime(DataSetStream_Async* bond)
{
	std::mutex self_lock;
	std::unique_lock<std::mutex> locker(self_lock);
	while (bond->_readerRun)
	{
		//if (!bond->_readerRun) return;

		bond->_bufWriteIt = bond->_buffer.begin();
		for (; bond->_bufWriteIt != bond->_buffer.end() && bond->_packageLeft; ++bond->_bufWriteIt) {
			if (*bond->_bufWriteIt == nullptr) {
				*bond->_bufWriteIt = bond->_read();
				--bond->_packageLeft;
			}
		}
		bond->_bufWriteIt = bond->_buffer.end();
		bond->_releaseData.notify_one();
		bond->_awakeReader.wait(locker);
	}
}


// For Example

uint8_t buf4[4];

int readInt32(std::ifstream& stream) {
	for (int i = 3; i >= 0; --i)
		stream >> buf4[i];
	return *(int*)&buf4;
}

MNIST_DSStream::MNIST_DSStream(const std::string& pathToImg, const std::string& pathTolabel,
	size_t bufferSize) : DataSetStream(_packageLeft)
{
	_istream.open(pathToImg);
	_lstream.open(pathTolabel);

	// skip useless data
	{
		_istream.read((char*)buf4, 4);
		_lstream.read((char*)buf4, 4);
		_lstream.read((char*)buf4, 4);
	}

	this->_packageLeft = readInt32(_istream);

	int row = readInt32(_istream), col = readInt32(_istream);
	this->_imgSize = row * col;
}

MNIST_DSStream::~MNIST_DSStream() {
	_istream.close();
	_lstream.close();
}

MNIST_DSStream::Package* MNIST_DSStream::_read()
{
	uint8_t byte;
	_lstream >> byte;
	Package* package = new Package(_imgSize, byte);

	for (size_t i = 0; i < _imgSize; i++)
	{
		_istream >> byte;
		package->data[i] = (double)byte / 255;
	}

	return package;
}

MNIST_DSStream::Package::Package(size_t size, uint8_t label) : data(size)
{ this->label = label; }

MNIST_DSStream::Package* MNIST_DSStream::nextPackage() {
	return (MNIST_DSStream::Package*)DataSetStream::nextPackage();
}