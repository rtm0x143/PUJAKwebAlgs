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
	int calculateDistance(Point& startPoint, Point& endPoint);

public:
	Point point;
	Cell* parent;
	int distanceToStart;
	int distanceToEnd;

	int getDistanceSum() const;

	Cell(Point cellPoint, Point& previousPoint, Point& endPoint, Cell *parent);
};

class Grid
{
private: 
	char **_field;
	int _width;
	int _height;

public:
	int getWidth();
	int getHeight();

	Grid(int width, int height);

	void setGridValue(std::vector<Point*> points, char value);
	void setGridValue(Point point, char value);
	void setGridValue(Point *point, char value);
	void printGrid();

	char *operator[](int i);
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

static class Pathfinder
{
private:
	Pathfinder();

	static std::vector<Cell*> findCellNeighbors(
		Grid grid, 
		Cell* parentCell, 
		Point previousPoint,
		Point endPoint
	);
	
	// This method adds a path to the existing vector of all astar steps 
	// (needed to transfer data to the client) 
	static void retracePath(
		std::vector<Point>* pathfinderResult,
		Point startCell,
		Cell* endCell
	);
public:
	static PathfinderResult findPath(Grid grid, Point startPoint, Point endPoint);
};
