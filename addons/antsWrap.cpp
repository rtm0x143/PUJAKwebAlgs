#include "napi.h"
#include "algs/Colony.h"
#include "algs/AntsRuntime.h"

AntsRuntime antsRuntime;
ColonyConfig deafultConfig{ 100, 1, 1, 0.5 };

Napi::Value launch(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    } else if (!info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Uint16Array points = info[0].As<Napi::Uint16Array>();
    Napi::Number sessionId;
    ColonyConfig config = deafultConfig;

    if (info.Length() == 2)
    {
        if (!info[1].IsObject()) {
            Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
            return env.Undefined();
        }
        Napi::Object settings = info[1].ToObject();

        if (settings.Has("antsCount"))
            config.antsCount = settings.Get("anysCount").ToNumber().Int32Value();
        if (settings.Has("greedCoef"))
            config.greedCoef = settings.Get("greedCoef").ToNumber().DoubleValue();
        if (settings.Has("herdCoef"))
            config.herdCoef = settings.Get("herdCoef").ToNumber().DoubleValue();
        if (settings.Has("pherLeak"))
            config.pherLeak = settings.Get("pherLeak").ToNumber().DoubleValue();
    }

    uint64_t id = antsRuntime.launch(config, points.Data(), points.ElementLength() / 2);
    return Napi::String::New(env, std::to_string(id));
}

void checkForId(const Napi::CallbackInfo& info, uint64_t& id) 
{
    if (!info[0].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments type").ThrowAsJavaScriptException();
    }
    
    std::stoull(info[0].ToString(), &id);
}

Napi::Value hasSession(const Napi::CallbackInfo& info) 
{
    uint64_t id;
    checkForId(info, id);

    return Napi::Boolean::New(info.Env(), antsRuntime.hasSession(id));
}

Napi::Value getNextEpoch(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    uint64_t id;
    checkForId(info, id);

    std::pair<std::vector<uint16_t>, double> epochResult = antsRuntime.getEpochResult(id);
    Napi::Uint16Array path = Napi::Uint16Array::New(env, epochResult.first.size());

    uint16_t* pathData = epochResult.first.data();
    for (size_t i = 0; i < epochResult.first.size(); ++i) {
        path[i] = pathData[i];
    }
    
    Napi::Object result = Napi::Object::New(env);
    result.Set(Napi::String::New(env, "path"), path);
    result.Set(Napi::String::New(env, "cost"), epochResult.second);

    return result;
}

Napi::Value terminateSession(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    uint64_t id;
    checkForId(info, id);

    antsRuntime.terminate(id);
    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) 
{
    exports.Set(Napi::String::New(env, "launch"), Napi::Function::New(env, launch));
    exports.Set(Napi::String::New(env, "hasSession"), Napi::Function::New(env, hasSession));
    exports.Set(Napi::String::New(env, "terminateSession"), Napi::Function::New(env, terminateSession));
    exports.Set(Napi::String::New(env, "getNextEpoch"), Napi::Function::New(env, getNextEpoch));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);