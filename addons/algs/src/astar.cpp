#include <iostream>
#include <vector>
#include "Astar.h"

#pragma region Point
Point::Point()
{
	x = -1;
	y = -1;
}

Point::Point(int x, int y)
{
	this->x = x;
	this->y = y;
}

bool Point::operator==(const Point& other) const
{
	if (x == other.x && y == other.y)
	{
		return true;
	}

	return false;
}

bool Point::operator!=(const Point& other) const
{
	if (x != other.x || y != other.y)
	{
		return true;
	}

	return false;
}
#pragma endregion

#pragma region Cell
int Cell::calculateDistance(Point& startPoint, Point& endPoint) 
{
	int dx = abs(startPoint.x - endPoint.x);
	int dy = abs(startPoint.y - endPoint.y);

	if (dx > dy)
	{
		return dy * diagonal + straight * (dx - dy);
	}

	return dx * diagonal + straight * (dy - dx);
}

Cell::Cell(Point cellPoint, Point& previousPoint, Point& endPoint, Cell *parent)
{
	point = cellPoint;
	this->parent = parent;
	distanceToStart = calculateDistance(previousPoint, point) + (parent == nullptr ? 0 : parent->distanceToStart);
	distanceToEnd = calculateDistance(point, endPoint);
}

int Cell::getDistanceSum() const
{
	return distanceToStart + distanceToEnd;
}
#pragma endregion

#pragma region Grid
Grid::Grid(int width, int height)
{
	_width = width;
	_height = height;
	_field = new char *[_width];

	for (size_t i = 0; i < _width; i++)
	{
		_field[i] = new char[_height];

		for (size_t j = 0; j < _height; j++)
		{
			_field[i][j] = 'p';
		}
	}
}

int Grid::getWidth()
{
	return _width;
}

int Grid::getHeight()
{
	return _height;
}

void Grid::setGridValue(std::vector<Point*> points, char value)
{
	for (size_t i = 0; i < points.size(); i++)
	{
		_field[points[i]->x][points[i]->y] = value;
	}
}

void Grid::setGridValue(Point *point, char value)
{
	_field[point->x][point->y] = value;
}


void Grid::setGridValue(Point point, char value)
{
	_field[point.x][point.y] = value;
}

void Grid::printGrid()
{
	for (size_t i = 0; i < _height; i++)
	{
		for (size_t j = 0; j < _width; j++)
		{
			std::cout << _field[j][i] << " ";
		}

		std::cout << "\n";
	}
}

char* Grid::operator[](int i)
{
	return _field[i];
}
#pragma endregion

#pragma region PathfinderResult
PathfinderResult::PathfinderResult(
	int stepsCount,
	std::vector<Point> stepsAndPath
)
{	
	this->stepsCount = stepsCount;
	this->stepsAndPath = stepsAndPath;
	
}
#pragma endregion

#pragma region Pathfinder
Pathfinder::Pathfinder() {}

std::vector <Cell*> Pathfinder::findCellNeighbors(
	Grid grid,
	Cell* parentCell,
	Point previousPoint,
	Point endPoint
)
{
	std::vector<Cell*> neighbors = std::vector<Cell*>();

	for (int i = -1; i <= 1; i++)
	{
		for (int j = -1; j <= 1; j++)
		{
			if (i == 0 && j == 0)
			{
				continue;
			}

			int moveX = parentCell->point.x + j;
			int moveY = parentCell->point.y + i;

			if ((moveX >= 0 && moveX < grid.getWidth()) && 
				(moveY >= 0 && moveY < grid.getHeight()))
			{
				if (grid[moveX][moveY] != 'w')
				{
					neighbors.push_back(
						new Cell(
							Point(moveX, moveY),
							previousPoint,
							endPoint,
							parentCell
						)
					);
				}
			}
		}
	}

	return neighbors;
}

void Pathfinder::retracePath(
	std::vector<Point>* stepsAndPath,
	Point startCellPoint, 
	Cell* endCell
)
{
	Cell* currentCell = endCell;

	while (currentCell->parent->point != startCellPoint)
	{
		stepsAndPath->push_back(currentCell->parent->point);
		currentCell = currentCell->parent;
	}
}

PathfinderResult Pathfinder::findPath(Grid grid, Point startPoint, Point endPoint)
{
	// Cell current;
	std::vector<Point> stepsAndPath;
	std::vector<Cell*> availableCells;
	std::vector<Cell*> visitedCells;
	availableCells.push_back(new Cell(startPoint, startPoint, endPoint, nullptr));
	int stepsCount = 0;

	while (!availableCells.empty())
	{
		// current = availableCells[0];
		size_t minCellIndex = 0;

		for (size_t i = 1; i < availableCells.size(); i++)
		{
			if (availableCells[i]->getDistanceSum() <= availableCells[minCellIndex]->getDistanceSum())
			{
				if (availableCells[i]->distanceToEnd < availableCells[minCellIndex]->distanceToEnd)
				{
					minCellIndex = i;
				}
				// current = availableCells[i];
			}
		}

		stepsCount++;
		stepsAndPath.push_back(availableCells[minCellIndex]->point);

		if (availableCells[minCellIndex]->point == endPoint)
		{
			retracePath(
				&stepsAndPath,
				startPoint,
				availableCells[minCellIndex]
			);
			
			break;
		}


		std::vector<Cell*> neighbors = findCellNeighbors(
			grid, 
			availableCells[minCellIndex],
			availableCells[minCellIndex]->point,
			endPoint
		);

		visitedCells.push_back(availableCells[minCellIndex]);
		availableCells.erase(availableCells.begin() + minCellIndex);

		for (Cell* neighbor : neighbors)
		{
			bool isVisited = false;
			
			for (Cell* visitedCell : visitedCells)
			{
				if (neighbor->point == visitedCell->point)
				{
					isVisited = true;
					break;
				}
			}

			if (isVisited)
			{
				continue;
			}

			int neighborIndex = -1;

			for (size_t i = 0; i < availableCells.size(); i++)
			{
				if (availableCells[i]->point == neighbor->point)
				{
					neighborIndex = i;
					break;
				}
			}

			if (neighborIndex == -1)
			{
				availableCells.push_back(neighbor);
			}
			else if (neighbor->distanceToStart < availableCells[neighborIndex]->distanceToStart)
			{
				availableCells[neighborIndex] = neighbor;
			}
		}
	}

	for (size_t i = 0; i < availableCells.size(); i++)
	{
		delete availableCells[i];
	}

	for (size_t i = 0; i < visitedCells.size(); i++)
	{
		delete visitedCells[i];
	}

	return PathfinderResult(stepsCount, stepsAndPath);
}
#pragma endregion
