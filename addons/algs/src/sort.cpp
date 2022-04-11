#include "../sort.h"
#include <iostream>

void sort(uint16_t** matrix, uint16_t length, uint16_t leftBorder, uint16_t rightBorder) {
	if (leftBorder >= rightBorder) return;

	uint16_t key = matrix[rand() % length][length];
	uint16_t left = leftBorder;
	uint16_t right = rightBorder;

	while (left <= right) {
		while (matrix[left][length] < key) left++;
		while (matrix[right][length] > key) right--;

		if (left >= right)
		{
			break;
		}

		if (left < right) {
			std::swap(matrix[left], matrix[right]);
			right--;
			left++;
		}
	}

	sort(matrix, length, leftBorder, right);
	sort(matrix, length, right + 1, rightBorder);
}
