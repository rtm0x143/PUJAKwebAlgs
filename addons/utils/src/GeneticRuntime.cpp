#include "GeneticRuntime.h"
#include "__SimulationRuntime.cpp"

template class SimulationRuntime<Genetic, std::pair<std::vector<uint16_t>, double>>;
