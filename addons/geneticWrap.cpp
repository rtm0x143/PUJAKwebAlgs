#include "napi.h"
#include "Genetic.h"
#include "GeneticRuntime.h"
#include "tools.h"

GeneticRuntime geneticRuntime;

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

    Napi::Uint16Array pointsData = info[0].As<Napi::Uint16Array>();
    uint32_t pointsCount = pointsData.ElementLength() / 2;

    Graph* graph = new Graph(pointsCount,
        tools::genGraphFromPoints(pointsData.Data(), pointsCount));

    Genetic* simulation = new Genetic(graph);
    uint64_t id = geneticRuntime.attach(simulation);

    return Napi::String::New(env, std::to_string(id));
}

uint64_t checkForId(const Napi::CallbackInfo& info) 
{
    if (!info[0].IsString()) {
        Napi::TypeError::New(info.Env(), "Invalid arguments type").ThrowAsJavaScriptException();
    }
    return info[0].ToNumber().Int64Value();
}

Napi::Value hasSession(const Napi::CallbackInfo& info) 
{
    uint64_t id = checkForId(info);

    return Napi::Boolean::New(info.Env(), geneticRuntime.hasSession(id) != nullptr);
}

Napi::Value getNextEpoch(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    uint64_t id = checkForId(info);

    std::pair<std::vector<uint16_t>, double>* epochResult = geneticRuntime.getEpochResult(id);
    Napi::Uint16Array path = Napi::Uint16Array::New(env, epochResult->first.size());

    uint16_t* pathData = epochResult->first.data();
    for (size_t i = 0; i < epochResult->first.size(); ++i) {
        path[i] = pathData[i];
    }
    
    Napi::Object result = Napi::Object::New(env);
    result.Set(Napi::String::New(env, "path"), path);
    result.Set(Napi::String::New(env, "cost"), epochResult->second);
    delete epochResult;

    return result;
}

Napi::Value terminateSession(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    uint64_t id = checkForId(info);

    delete geneticRuntime.detach(id);
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