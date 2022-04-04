#pragma once
#include <malloc.h>
#include <cstdint>
#include <stdlib.h>

typedef uint16_t u16;

class Graph
{
public:
	u16 length;
	u16** matrix;
	u16** ways;

	Graph(u16 length, u16** matrix);

	~Graph() {
		delete[] ways;
	};

	void setWay(u16 index);

	u16 getMinWeight(u16** matrix);
	u16 getMaxWeightIndex(u16** matrix);
	int32_t getMaxWeightIndex(u16** matrix, u16* way);
	u16 countWeight(u16* way);

private:
	//create random way on Graph
	u16* getRandomArray(u16 index) {
		bool* visits = new bool[length];

		for (int i = 0; i < length; ++i) {
			visits[i] = false;
		}

		u16* way = new u16[length];

		u16 counter = 0;
		while (counter < length) {
			u16 prob = rand() % length;

			if (!visits[prob]) {
				visits[prob] = true;
				way[counter] = prob;
				++counter;
			}
		};

		return way;
		delete[] way;
		delete[] visits;
	}
};
