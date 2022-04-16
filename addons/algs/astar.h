#pragma once
#include <string>
#include <vector>
#include <iostream>

struct Point
{
public:
	int x;
	int y;

	Point();
	Point(int x, int y);
	// Point(std::string input);

	bool operator==(const Point& other) const;
	bool operator!=(const Point& other) const;
};

const int straight = 10;
const int diagonal = 14;

class Cell
{
private:
	// static int calculateDistance(Point& startPoint, Point& endPoint,
	// 	double(*metricFunc)(const Point&, const Point&));
	
	double(*calculateDistance)(const Point&, const Point&);

public:
	Point point;
	Cell* parent;
	int distanceToStart;
	int distanceToEnd;

	int getDistanceSum() const;

	Cell(Point cellPoint, Point& previousPoint, Point& endPoint, Cell* parent,
		double(*metricFunc)(const Point&, const Point&));
};

class Grid
{
private:
	uint8_t** _field;
	int _width;
	int _height;

public:
	int getWidth();
	int getHeight();

	Grid(uint8_t** field, int width, int height);
	// Grid(int width, int height);

	void setGridValue(std::vector<Point*> points, uint8_t value);
	void setGridValue(Point point, uint8_t value);
	void setGridValue(Point* point, uint8_t value);
	void printGrid();

	uint8_t* operator[](int i);
};

struct PathfinderResult
{
public:
	int stepsCount;
	std::vector<Point> stepsAndPath;

	PathfinderResult(
		int stepsCount,
		std::vector<Point> stepsAndPath
	);
};

class Pathfinder
{
private:
	std::vector<Cell*> findCellNeighbors(
		Grid grid,
		Cell* parentCell,
		Point previousPoint,
		Point endPoint
	);

	// This method adds a path to the existing vector of all astar steps 
	// (needed to transfer data to the client) 
	void retracePath(
		std::vector<Point>* pathfinderResult,
		Point startCell,
		Cell* endCell
	);

	double(*metricFunc)(const Point&, const Point&);

public:
	PathfinderResult findPath(Grid grid, Point startPoint, Point endPoint);

	Pathfinder(double(*metric)(const Point&, const Point&));
};

namespace metricsV
{
	double(*metricFromName(const std::string& name))(const Point& p1, const Point& p2);

	double Euclidean(const Point& p1, const Point& p2);

	double EuclideanCubes(const Point& p1, const Point& p2);

	double Chebyshev(const Point& p1, const Point& p2);

	double Manhattan(const Point& p1, const Point& p2);
}