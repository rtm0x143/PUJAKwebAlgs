#include <cmath>
#include <algorithm>
#include "AntsRuntime.h"
#include "tools.h"
#include <iostream>

AntsRuntime::AntsRuntime() : sessions(0), terminateFlag(false)
{
	worker = std::thread(workerRuntime, &terminateFlag, 
		&tasksUpdated, &tasks, &tasksMutex, &tasksDone);
}

AntsRuntime::~AntsRuntime() 
{
	terminateFlag = false;
	if (worker.joinable()) {
		worker.join();
	}
	for (Session* s : sessions) {
		delete s->colony;
		delete s->_mutex;
		delete s;
	}
}

void AntsRuntime::workerRuntime(
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
			std::cout << "Currant task - " << task->id << '\n';
			{
				std::unique_lock<std::mutex> lock(*task->_mutex);
				if (task->colony) 
					task->result = task->colony->iterate();
				
			}
		}
	}
}

bool AntsRuntime::hasSession(const uint64_t& id)
{
	std::cout << "Seaks for " << id << " Has " << sessions.size() << " sessions:\n\t";
	for (Session* s : sessions) std::cout << s->id << ' ';
	std::cout << '\n';
	
	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });

	return s_it != sessions.end();
}

uint64_t AntsRuntime::launch(const ColonyConfig& colonySettings, uint16_t* points, uint32_t pCount)
{
	double** graph = tools::genGraphFromPoints(points, pCount);
	
	Session* session = new Session{
			++idCounter,
			new Colony(colonySettings, graph, pCount),
			std::pair<std::vector<uint16_t>, double>{ 0, 0 },
			new std::mutex
	};

	sessions.push_back(session);

	tasksMutex.lock();
	tasks.push_back(sessions.back());
	tasksMutex.unlock();

	tasksUpdated.notify_one();
	return session->id;
}

std::pair<std::vector<uint16_t>, double>  AntsRuntime::getEpochResult(const uint64_t& id)
{
	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });

	std::mutex _mutex;
	std::unique_lock<std::mutex> selfLock(_mutex);
	while (true) {
		{
			std::unique_lock<std::mutex> slock(*(*s_it)->_mutex),
				tlock(tasksMutex);
			if (!(*s_it)->result.first.empty()) break;
		}
		tasksDone.wait(selfLock);
	}

	std::unique_lock<std::mutex> slock(*(*s_it)->_mutex),
		tlock(tasksMutex);

	std::pair<std::vector<uint16_t>, double>  result = std::move((*s_it)->result);
	tasks.push_back(*s_it);
	tasksUpdated.notify_one();

	return result;
}

void AntsRuntime::terminate(const uint64_t& id)
{
	tasksMutex.lock();
	std::remove_if(tasks.begin(), tasks.end(),
		[&id](Session* ps) -> bool { return ps->id == id; });
	tasksMutex.unlock();

	auto s_it = std::find_if(sessions.begin(), sessions.end(),
		[&id](const Session* s) -> bool { return s->id == id; });

	delete (*s_it)->colony;
	delete (*s_it)->_mutex;
	delete *s_it;
	sessions.erase(s_it);
}