// #include <list>
// #include <ctime>
// #include <random>
// #include <vector>

// namespace labirint {
//     struct Cell {
//         int i;
//         int j;
//     };

//     uint8_t** matrix;
//     std::list<Cell> edges;
//     int _height;
//     int _width;

//     void addEdges(int i, int j) {
//         if (i - 2 >= 0) {
//             if (matrix[i - 2][j] == 1) {
//                 edges.push_back(Cell{ i - 2, j });
//             }
//         }

//         if (i + 2 < _height) {
//             if (matrix[i + 2][j] == 1) {
//                 edges.push_back(Cell{ i + 2, j });
//             }
//         }

//         if (j - 2 >= 0 && matrix[i][j - 2] == 1) {
//             if (matrix[i][j - 2] == 1) {
//                 edges.push_back(Cell{ i, j - 2 });
//             }
//         }

//         if (j + 2 < _width) {
//             if (matrix[i][j + 2] == 1) {
//                 edges.push_back(Cell{ i, j + 2 });
//             }
//         }

//         // for (int n = -2; n <= 2; n += 2) {
//         //     for (int m = -2; m <= 2; m += 2) {
//         //         if (n == 0 && m == 0) continue;
//         //         int moveX = j + m;
//         //         int moveY = i + n;

//         //         if (
//         //             moveX >= 0 && moveX < _width &&
//         //             moveY >= 0 && moveY < _height
//         //         ) {
//         //             if (matrix[moveY][moveX] == 1) edges.push_back(Cell{ moveY, moveX });    
//         //         }  
//         //     }
//         // }
//     }

//     Cell checkEdges(int i, int j) {
//         // std::vector<Cell> cells;
//         // int k = 0;

//         if (i - 2 >= 0) {
//             if (matrix[i - 2][j] == 0) {
//                 return Cell{ i - 2, j };
//                 // cells[k++] = Cell{ i - 2, j };
//             }
//         }

//         if (i + 2 < _height) {
//             if (matrix[i + 2][j] == 0) {
//                 return Cell{ i + 2, j };
//                 // cells[k++] = Cell{ i + 2, j };
//             }
//         }

//         if (j - 2 >= 0) {
//             if (matrix[i][j - 2] == 0) {
//                 return Cell{ i, j - 2 };
//                 // cells[k++] = Cell{ i, j  - 2 };
//             }
//         }

//         if (j + 2 < _width) {
//             if (matrix[i][j + 2] == 0) {
//                 return Cell{ i, j + 2 };
//                 // cells[k] = Cell{ i, j + 2 };
//             }
//         }

//         // for (int n = -2; n <= 2; n += 2) {
//         //     for (int m = -2; m <= 2; m += 2) {
//         //         if (n == 0 && m == 0) continue;
//         //         int moveX = j + m;
//         //         int moveY = i + n;
                
//         //         if (
//         //             moveX >= 0 && moveX < _width &&
//         //             moveY >= 0 && moveY < _height
//         //         ) {
//         //             if (matrix[moveY][moveX] == 0) cells.push_back(Cell{ moveY, moveX });
//         //         }
//         //     }
//         // }

//         // return cells[rand() % k];
//     }

//     // int getSign(int number) {
//     //     if (number < 0) {
//     //         return -1;
//     //     }
//     //     else if (number == 0) {
//     //         return 0;
//     //     }

//     //     return 1;
//     // } 

//     // void pavePath(Cell currentCell, Cell clearedCell) {
//     //     for (int i = -2; i <= 2; i += 2)
//     //     {
//     //         for (int j = -2; j <= 2; j += 2)
//     //         {
//     //             if (clearedCell.i + i == currentCell.i && clearedCell.j + j == currentCell.j) {
//     //                 matrix[currentCell.i + getSign(i)][currentCell.j + getSign(j)] = 0;
//     //             }
//     //         }
//     //     }
//     // }

//     int random(int min, int max) //range : [min, max]
//     {
//         static bool isFirst = true;
//         if (isFirst) 
//         {  
//             srand( time(NULL) ); //seeding for the first time only!
//             isFirst = false;
//         }

//         return min + rand() % (max - min);
//     }

//     uint8_t** generateLabirint(int width, int height) {
//         _width = width;
//         _height = height;

//         matrix = new uint8_t* [height];
//         for (int i = 0; i < height; ++i) {
//             matrix[i] = new uint8_t[width];

//             for (int j = 0; j < width; ++j) {
//                 matrix[i][j] = 1;
//             }
//         }
        

//         int i = random(0, height / 2) * 2 + 1;
//         int j = random(0, width / 2) * 2 + 1;

//         matrix[i][j] = 0;
//         addEdges(i, j);
        
//         while (edges.size() > 0) {
//             int index = random(0, edges.size());

//             std::list<Cell>::iterator element = edges.begin();
//             for (int i = 0; i <= index; ++element, ++i);

//             i = (*element).i;
//             j = (*element).j;

//             matrix[i][j] = 0;
//             edges.erase(element);
            
//             Cell clearCell = checkEdges(i, j);
//             // pavePath(*element, clearCell);
//             if (j == clearCell.j) {
//                 if (i - 2 == clearCell.i) {
//                     matrix[i - 1][j] = 0;
//                 }
//                 else if (i + 2 == clearCell.i) {
//                     matrix[i + 1][j] = 0;
//                 }
//             }

//             if (i == clearCell.i) {
//                 if (j - 2 == clearCell.j) {
//                     matrix[i][j - 1] = 0;
//                 }
//                 else if (j + 2 == clearCell.j) {
//                     matrix[i][j + 1] = 0;
//                 }
//             }

//             addEdges(i, j);
//         }

//         return matrix;
//     }
// }
#include <list>
#include <ctime>
#include <vector>

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

        if (j - 2 >= 0) {
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
        Cell cells[4];
        int k = 0;

        if (i - 2 >= 0) {
            if (matrix[i - 2][j] == 0) {
                // return Cell{ i - 2, j };
                cells[k++] = Cell{ i - 2, j };
            }
        }

        if (i + 2 < _height) {
            if (matrix[i + 2][j] == 0) {
                // return Cell{ i + 2, j };
                cells[k++] = Cell{ i + 2, j };
            }
        }

        if (j - 2 >= 0) {
            if (matrix[i][j - 2] == 0) {
                // return Cell{ i, j - 2 };
                cells[k++] = Cell{ i, j - 2 };
            }
        }

        if (j + 2 < _width) {
            if (matrix[i][j + 2] == 0) {
                // return Cell{ i, j + 2 };
                cells[k++] = Cell{ i, j + 2 };
            }
        }

        if (k != 0) return cells[rand() % k];
    }

    int random(int min, int max) {
        static bool isFirst = true;

        if (isFirst) 
        {  
            srand( time(NULL) ); //seeding for the first time only!
            isFirst = false;
        }

        return min + rand() % (max - min);
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
        
        int i = random(0, height);
        int j = random(0, width);

        matrix[i][j] = 0;
        addEdges(i, j);
        
        while (edges.size() > 0) {
            int index = random(0, edges.size());

            std::list<Cell>::iterator element = edges.begin();
            for (int i = 0; i < index; ++i) {
                ++element;
            }

            i = (*element).i;
            j = (*element).j;

            matrix[i][j] = 0;
            std::vector<int> d{ 0, 1, 2, 3 };

            while (d.size() > 0) {
                int dirIndex = random(0, d.size());
                switch (dirIndex) {
                    case 0:
                        if (i - 2 >= 0 && matrix[i - 2][j] == 0) {
                            matrix[i - 1][j] = 0;
                            d.clear();
                        }
                        break;
                    case 1:
                        if (i + 2 < height && matrix[i + 2][j] == 0) {
                            matrix[i + 1][j] = 0;
                            d.clear();
                        }
                        break;
                    case 2:
                        if (j - 2 >= 0 && matrix[i][j - 2] == 0) {
                            matrix[i][j - 1] = 0;
                            d.clear();
                        }
                        break;
                    case 3:
                        if (j + 2 < width && matrix[i][j + 2] == 0) {
                            matrix[i][j + 1] = 0;
                            d.clear();
                        }
                        break;
                }
                if (d.size() > 0) {
                    d.erase(d.begin() + dirIndex);
                }
            }
            // Cell clearCell = checkEdges(i, j);

            // if (j == clearCell.j) {
            //     if (i - 2 == clearCell.i) {
            //         matrix[i - 1][j] = 0;
            //     }
            //     else if (i + 2 == clearCell.i) {
            //         matrix[i + 1][j] = 0;
            //     }
            // }

            // if (i == clearCell.i) {
            //     if (j - 2 == clearCell.j) {
            //         matrix[i][j - 1] = 0;
            //     }
            //     else if (j + 2 == clearCell.j) {
            //         matrix[i][j + 1] = 0;
            //     }
            // }

            edges.erase(element);
            addEdges(i, j);
        }

        return matrix;
    }
}