#include <iostream>
#include <algorithm>
#include "__SimulationRuntime.h"

template <class Simulation, class State>
SimulationRuntime<Simulation, State>::SimulationRuntime() 
	: sessions(0), terminateFlag(false)
{
	worker = std::thread(workerRuntime, &terminateFlag,
		&tasksUpdated, &tasks, &tasksMutex, &tasksDone);
}

template <class Simulation, class State>
SimulationRuntime<Simulation, State>::~SimulationRuntime()
{
	terminateFlag = false;
	tasksUpdated.notify_one();
	if (worker.joinable()) {
		worker.join();
	}
	for (Session* s : sessions) {
		// delete s->sim;
		delete s->_mutex;
		delete s->result;
		delete s;
	}
}

template <class Simulation, class State>
void SimulationRuntime<Simulation, State>::workerRuntime(
	bool* terminate, std::condition_variable* queueUpdated,
	std::vector<Session*>* tasks, std::mutex* queueMutex,
	std::condition_variable* tasksDone)
{
	std::mutex _mutex;
	std::unique_lock< std::mutex> selfLock(_mutex);

	while (!*terminate)
	{
		do {
			std::unique_lock<std::mutex> lock(*queueMutex);
			if (!tasks->empty()) break;
			lock.unlock();
			queueUpdated->wait(selfLock);
		} while (!*terminate);

		while (!*terminate)
		{
			Session* task;
			{
				std::unique_lock<std::mutex> lock(*queueMutex);
				if (tasks->empty()) {
					tasksDone->notify_one();
					break;
				}
				task = tasks->back();
				tasks->pop_back();
			}
			{
				std::unique_lock<std::mutex> lock(*task->_mutex);
				task->result = (*task->sim)();
			}
		}
	}
}

template <class Simulation, class State>
Simulation* SimulationRuntime<Simulation, State>::hasSession(const uint64_t& id)
{
	std::cout << "Seaks for " << id << " Has " << sessions.size() << " sessions:\n\t";
	for (Session* s : sessions) std::cout << s->id << ' ';
	std::cout << '\n';

	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });

	if (s_it != sessions.end()) std::cout << (*s_it)->id << '\n';
	else std::cout << "Not found\n";

	return (s_it != sessions.end() ? (*s_it)->sim : nullptr);
}

template <class Simulation, class State>
uint64_t SimulationRuntime<Simulation, State>::attach(Simulation* sim)
{
	Session* session = new Session{
			++idCounter, sim, nullptr, new std::mutex
	};

	sessions.push_back(session);

	tasksMutex.lock();
	tasks.push_back(sessions.back());
	tasksMutex.unlock();

	tasksUpdated.notify_one();
	return session->id;
}

template <class Simulation, class State>
State* SimulationRuntime<Simulation, State>::getEpochResult(const uint64_t& id)
{
	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });

	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);
	while (true) {
		{
			std::unique_lock<std::mutex> slock(*(*s_it)->_mutex),
				tlock(tasksMutex);
			if (!(*s_it)->result) break;
		}
		tasksDone.wait(selfLock);
	}

	std::unique_lock<std::mutex> slock(*(*s_it)->_mutex),
		tlock(tasksMutex);

	State* result = (*s_it)->result;
	(*s_it)->result = nullptr;
	tasks.push_back(*s_it);
	tasksUpdated.notify_one();

	return result;
}

template <class Simulation, class State>
Simulation* SimulationRuntime<Simulation, State>::detach(const uint64_t& id)
{
	tasksMutex.lock();
	std::remove_if(tasks.begin(), tasks.end(),
		[&id](Session* ps) -> bool { return ps->id == id; });
	tasksMutex.unlock();

	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });
	
	Simulation* sim = nullptr;
	if (s_it != sessions.end()) {
		sim = (*s_it)->sim;
		// delete (*s_it)->sim;
		delete (*s_it)->_mutex;
		delete *s_it;
		sessions.erase(s_it);
	}
	std::cout << "c++deleted " << id << ' ' << sim << '\n';
	return sim;
}


// template class SimulationRuntime<Colony, std::pair<std::vector<uint16_t>, double>>;
// template class SimulationRuntime<Genetic, std::pair<std::vector<uint16_t>, double>>;