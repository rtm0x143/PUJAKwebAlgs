#pragma once
#include <fstream>

class BinImage
{
private:
	char* _data;
	size_t _height, _width, 
		_pxSize;

public:
	BinImage(size_t heights, size_t width, size_t pxSize);
	BinImage(BinImage& other);
	BinImage(BinImage&& other) noexcept;
	~BinImage();

	static BinImage readImage(std::ifstream& stream, size_t height, size_t width, size_t pxSize);

	size_t height();
	size_t width();
	size_t pxSize();
	char* data();

	void rescale(size_t newHeight, size_t newWidth);

	void console_log();
};

