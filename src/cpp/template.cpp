#include "napi.h"
#include <thread>

static long long result = 0;
std::thread worker;

void work() {
  
}

void launch(const Napi::CallbackInfo& info) 
{
    worker.swap(std::thread(work));   
}

Napi::Number getResult(const Napi::CallbackInfo& info) {
    worker.join();
    return Napi::Number::New(info.Env(), result);
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "launch"), Napi::Function::New(env, launch));
    exports.Set(Napi::String::New(env, "getResult"), Napi::Function::New(env, getResult));

    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);