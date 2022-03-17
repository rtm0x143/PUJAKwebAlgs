#include "napi.h"
// #include "algs/..."

Napi::Value run(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    


    return env.Null();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "run"), Napi::Function::New(env, run));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);