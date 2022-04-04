#include "napi.h"
// #include "algs/..."

Napi::Value genetic(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    

    return env.Null();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "genetic"), Napi::Function::New(env, genetic));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);