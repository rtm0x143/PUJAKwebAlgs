#include "napi.h"
// #include "algs/..."

Napi::Value astrar(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    

    return env.Null();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "astrar"), Napi::Function::New(env, astrar));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);