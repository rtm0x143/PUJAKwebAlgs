#include "napi.h"
#include <iostream>
#include <string>

void test(const Napi::CallbackInfo& info) 
{
    std::cout << info[0].As<Napi::String>() << '\n';
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "test"), Napi::Function::New(env, test));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);