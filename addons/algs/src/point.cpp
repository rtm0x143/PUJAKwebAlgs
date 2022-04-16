#include "../point.h";

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