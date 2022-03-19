#include <list>
#include <ctime>

namespace labirint {
    struct Cell {
        int i;
        int j;
    };

    uint8_t** matrix;
    std::list<Cell> edges;
    int _height;
    int _width;

    void addEdges(int i, int j) {
        if (i - 2 >= 0) {
            if (matrix[i - 2][j] == 1) {
                edges.push_back(Cell{ i - 2, j });
            }
        }

        if (i + 2 < _height) {
            if (matrix[i + 2][j] == 1) {
                edges.push_back(Cell{ i + 2, j });
            }
        }

        if (j - 2 >= 0 && matrix[i][j - 2] == 1) {
            if (matrix[i][j - 2] == 1) {
                edges.push_back(Cell{ i, j - 2 });
            }
        }

        if (j + 2 < _width) {
            if (matrix[i][j + 2] == 1) {
                edges.push_back(Cell{ i, j + 2 });
            }
        }
    }

    Cell checkEdges(int i, int j) {
        if (i - 2 >= 0) {
            if (matrix[i - 2][j] == 0) {
                return Cell{ i - 2, j };
            }
        }

        if (i + 2 < _height) {
            if (matrix[i + 2][j] == 0) {
                return Cell{ i + 2, j };
            }
        }

        if (j - 2 >= 0) {
            if (matrix[i][j - 2] == 0) {
                return Cell{ i, j - 2 };
            }
        }

        if (j + 2 < _width) {
            if (matrix[i][j + 2] == 0) {
                return Cell{ i, j + 2 };
            }
        }
    }

    uint8_t** generateLabirint(int width, int height) {
        srand((unsigned int)time(0));
        _width = width;
        _height = height;

        matrix = new uint8_t* [height];
        for (int i = 0; i < height; ++i) {
            matrix[i] = new uint8_t[width];

            for (int j = 0; j < width; ++j) {
                matrix[i][j] = 1;
            }
        }
        

        int i = ((double)rand() / (RAND_MAX + 1)) * height;
        int j = ((double)rand() / (RAND_MAX + 1)) * width;;

        matrix[i][j] = 1;
        addEdges(i, j);
        
        while (edges.size() > 0) {
            int index = (double)rand() / (RAND_MAX + 1) * edges.size();

            std::list<Cell>::iterator element = edges.begin();
            for (int i = 0; i < index; ++i) {
                ++element;
            }

            i = (*element).i;
            j = (*element).j;

            matrix[i][j] = 0;
            Cell clearCell = checkEdges(i, j);

            if (j == clearCell.j) {
                if (i - 2 == clearCell.i) {
                    matrix[i - 1][j] = 0;
                }
                else if (i + 2 == clearCell.i) {
                    matrix[i + 1][j] = 0;
                }
            }

            if (i == clearCell.i) {
                if (j - 2 == clearCell.j) {
                    matrix[i][j - 1] = 0;
                }
                else if (j + 2 == clearCell.j) {
                    matrix[i][j + 1] = 0;
                }
            }

            addEdges(i, j);
            edges.erase(element);
        }

        return matrix;
    }
}
