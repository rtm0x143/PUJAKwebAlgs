#include "napi.h"
#include "algs/Colony.h"
#include <uuids.h>
#include <iostream>

ColonyConfig config = { 100, 0.75, 2.0, 0.6 }; 

Napi::Value init(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() != 1) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    } else if (!info[0].IsObject()) {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    } 

    Napi::Object object = info[0].ToObject();

    std::cout << object.GetPropertyNames() << '\n';

    if (object.Has("antsCount"))
        config.antsCount = object.Get("anysCount").ToNumber().Int32Value();
    if (object.Has("greedCoef"))
        config.greedCoef = object.Get("greedCoef").ToNumber().DoubleValue();
    if (object.Has("herdCoef"))
        config.herdCoef = object.Get("herdCoef").ToNumber().DoubleValue();
    if (object.Has("pherLeak"))
        config.pherLeak = object.Get("pherLeak").ToNumber().DoubleValue();

    return env.Undefined();
}

Napi::Value launch(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    if (info.Length() != 1) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    } else if (!info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Object session;

    return session;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "init"), Napi::Function::New(env, init));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);