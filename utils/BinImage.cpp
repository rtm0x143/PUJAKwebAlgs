#include <vector>
#include "BinImage.h"
#include <iostream>

BinImage::BinImage(size_t height, size_t width, size_t pxSize)
	: _height(height), _width(width), _pxSize(pxSize)
{
	_data = (char*)malloc(height * width * pxSize);
}

BinImage::BinImage(BinImage& other) 
	: _height(other._height), _width(other._width), _pxSize(other._pxSize) 
{
	size_t size = other._width * other._height * other._pxSize;
	_data = (char*)malloc(size);
	for (size_t i = 0; i < size; ++i)
	{
		_data[i] = other._data[i];
	}
}

BinImage::BinImage(BinImage&& other) noexcept : _height(other._height), _width(other._width), 
	_pxSize(other._pxSize), _data(other._data)
{
	other._data = nullptr;
}

BinImage::~BinImage() { delete[] _data; }

BinImage BinImage::readImage(std::ifstream& stream, size_t height, size_t width, size_t pxSize)
{
	BinImage image(height, width, pxSize);
	stream.read(image._data, height * width * pxSize);
	return image;
}

size_t BinImage::height() { return _height; }
size_t BinImage::width() { return _width; }
size_t BinImage::pxSize() { return _pxSize; }
char* BinImage::data() { return _data; }

void BinImage::rescale(size_t newHeight, size_t newWidth)
{
	char* newData = (char*)malloc(newHeight * newWidth * _pxSize);

	uint16_t generalDimX = newWidth / _width,
		remnantsX = newWidth % _width;
	uint16_t generalDimY = newHeight / _height,
		remnantsY = newHeight % _height;;

	std::vector<uint16_t> dimsX(_width, generalDimX);
	std::vector<uint16_t> dimsY(_height, generalDimY);

	for (int i = _width - 1; i >= 0; --i) 
		if (rand() % (i + 1) < remnantsX) {
			++dimsX[i]; --remnantsX;
		}
	for (int i = _height - 1; i >= 0; --i)
		if (rand() % (i + 1) < remnantsY) {
			++dimsY[i]; --remnantsY;
		}

	char* curPixel = _data;
	for (size_t i = 0, shiftY = 0; i < _height; shiftY += dimsY[i], ++i)
	{
		for (size_t j = 0, shiftX = 0; j < _width; shiftX += dimsX[j], ++j)
		{
			for (size_t pxi = 0; pxi < dimsY[i]; ++pxi)
			{
				char* newPixelLay = newData + _pxSize * (newWidth * (shiftY + pxi) + shiftX);
				for (size_t pxj = 0; pxj < dimsX[j]; ++pxj)
				{
					for (size_t pxByte = 0; pxByte < _pxSize; ++pxByte)
					{
						newPixelLay[pxByte] = curPixel[pxByte];
					}
					newPixelLay += _pxSize;
				}
			}
			curPixel += _pxSize;	
		}
	}
	delete[] _data;
	_data = newData;
	_height = newHeight;
	_width = newWidth;
}

void BinImage::console_log()
{
	char* curPixel = _data;
	for (size_t i = 0; i < _height; ++i)
	{
		for (size_t j = 0; j < _width; ++j)
		{
			size_t pxSum = (uint8_t)*curPixel;
			for (size_t pxi = 1; pxi < _pxSize; ++pxi)
			{
				pxSum += (uint8_t)curPixel[pxi];
			}
			pxSum /= _pxSize;

			if (pxSum < 50) printf(".");
			else if (pxSum < 150) printf("|");
			else printf("#");

			curPixel += _pxSize;
		}
		printf("\n");
	}
}