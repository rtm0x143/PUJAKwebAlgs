#include <iostream>
#include <string>
#include "BinImage.h"

const std::string datasetDir = "C:/Users/vsuha/source/repos/Neural network C++/Neural network C++/MNIST dataset";

namespace cringe {
	uint8_t buf4[4];

	int readBegInt32(std::ifstream& stream) {
		for (int i = 3; i >= 0; --i)
			stream >> buf4[i];
		return *(int*)&buf4;
	}

	void writeBegInt32(std::ofstream& stream, int num) {
		char* numBytes = (char*)&num;
		for (int i = 3; i >= 0; --i) 
			stream << numBytes[i];
	}
}

int main()
{   
	std::ifstream istream(datasetDir + "/t10k-images.idx3-ubyte", std::ios::in | std::ios::binary);
	int magicNumber = cringe::readBegInt32(istream),
		datasetSize = cringe::readBegInt32(istream),
		row = cringe::readBegInt32(istream), col = cringe::readBegInt32(istream);

	std::ofstream ostream(datasetDir + "/wide-t10k-images.idx3-ubyte", std::ios::out | std::ios::binary);
	cringe::writeBegInt32(ostream, magicNumber);
	cringe::writeBegInt32(ostream, datasetSize);
	cringe::writeBegInt32(ostream, 50);
	cringe::writeBegInt32(ostream, 50);

	for (size_t i = 0; i < datasetSize; ++i)
	{
		BinImage image = BinImage::readImage(istream, row, col, 1);
		image.rescale(50, 50);
		
		ostream.write(image.data(), image.height() * image.width() * image.pxSize());
	}

	istream.close();
	ostream.close();
    return 0;
}