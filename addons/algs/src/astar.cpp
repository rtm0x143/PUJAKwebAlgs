#include <iostream>
#include <vector>
#include "../Astar.h"

// using namespace metricsV;

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
	return x == other.x && y == other.y;
}

bool Point::operator!=(const Point& other) const
{
	return x != other.x || y != other.y;
}
#pragma endregion

#pragma region Cell
// int Cell::calculateDistance(Point& startPoint, Point& endPoint, 
// 	double(*metricFunc)(const Point&, const Point&))
// {
// 	int dx = abs(startPoint.x - endPoint.x);
// 	int dy = abs(startPoint.y - endPoint.y);

// 	if (dx > dy)
// 	{
// 		return dy * diagonal + straight * (dx - dy);
// 	}

// 	return dx * diagonal + straight * (dy - dx);
// }

Cell::Cell(Point cellPoint, Point& previousPoint, Point& endPoint, Cell* parent,
	double(*metricFunc)(const Point&, const Point&)) : calculateDistance(metricFunc)
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
Grid::Grid(uint8_t** field, int width, int height) :
	_field(field), _width(width), _height(height)
{
};

int Grid::getWidth()
{
	return _width;
}

int Grid::getHeight()
{
	return _height;
}

void Grid::setGridValue(std::vector<Point*> points, uint8_t value)
{
	for (size_t i = 0; i < points.size(); i++)
	{
		_field[points[i]->y][points[i]->x] = value;
	}
}

void Grid::setGridValue(Point* point, uint8_t value)
{
	_field[point->y][point->x] = value;
}


void Grid::setGridValue(Point point, uint8_t value)
{
	_field[point.y][point.x] = value;
}

void Grid::printGrid()
{
	for (size_t i = 0; i < _height; i++)
	{
		uint8_t* row = _field[i];
		for (size_t j = 0; j < _width; j++)
		{
			std::cout << ((char)row[j] == 0 ? '.' : (char)row[j]) << "";
		}

		std::cout << "\n";
	}
}

uint8_t* Grid::operator[](int i)
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
Pathfinder::Pathfinder(double(*metric)(const Point&, const Point&)) : metricFunc(metric)
{}

std::vector <Cell*> Pathfinder::findCellNeighbors(
	Grid grid,
	Cell* parentCell,
	Point previousPoint,
	Point endPoint
)
{
	std::vector<Cell*> neighbors;

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
				if (grid[moveY][moveX] != 1) // 'w'
				{
					neighbors.push_back(
						new Cell(
							Point(moveX, moveY),
							previousPoint,
							endPoint,
							parentCell,
							metricFunc
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
	availableCells.push_back(
		new Cell(startPoint, startPoint, endPoint, nullptr, metricFunc));

	int stepsCount = 0;

	while (!availableCells.empty())
	{
		size_t minCellIndex = 0;

		for (size_t i = 1; i < availableCells.size(); i++)
		{
			if (availableCells[i]->getDistanceSum() <= availableCells[minCellIndex]->getDistanceSum())
			{
				if (availableCells[i]->distanceToEnd < availableCells[minCellIndex]->distanceToEnd)
				{
					minCellIndex = i;
				}
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
				delete neighbor;
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
				delete availableCells[neighborIndex];
				availableCells[neighborIndex] = neighbor;
			}
			else delete neighbor;
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

double(*metricsV::metricFromName(const std::string& name))(const Point& p1, const Point& p2)
{
	if (name == "Euclidean") {
		return metricsV::Euclidean;
	} else if (name == "EuclideanCubes") {
		return metricsV::EuclideanCubes;
	} else if (name == "Manhattan") {
		return metricsV::Manhattan;
	} else if (name == "Chebyshev") {
		return metricsV::Chebyshev;
	} else {
		throw "Invalid metric name";
	}
}

double metricsV::Euclidean(const Point& p1, const Point& p2) {
	return std::sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

double metricsV::EuclideanCubes(const Point& p1, const Point& p2) {
	return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

double metricsV::Chebyshev(const Point& p1, const Point& p2) {
	return std::max(std::abs(p1.x - p2.x), std::abs(p1.y - p2.y));
}

double metricsV::Manhattan(const Point& p1, const Point& p2) {
	return std::abs(p1.x - p2.x) + std::abs(p1.y - p2.y);
}