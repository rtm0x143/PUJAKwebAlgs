#include "napi.h"
// #include "algs/..."


// field encoding : 0 - void, 1 - wall, 2 - start, 3 - end; 
Napi::Value astrar(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    } else if(!info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    uint8_t* field = info[0].As<Napi::Uint8Array>().Data(); 

    //

    return env.Null();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "astrar"), Napi::Function::New(env, astrar));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);