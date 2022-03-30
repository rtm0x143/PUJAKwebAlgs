#include "napi.h"
#include "clasterisation.h"

#include <iostream>
int a = 0;
Napi::Value DBSCAN(const Napi::CallbackInfo& args) 
{
    std::cout << a++ << ' ';
    Napi::Env env = args.Env();
    
    if (args.Length() < 3) {
        Napi::TypeError::New(env, "Invalid argument count, 3 needed").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (!args[0].IsTypedArray() || !args[1].IsNumber() || !args[2].IsNumber()){
        Napi::TypeError::New(env, "Invalid arguments").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    uint8_t clusterCount;
    Napi::Uint16Array points = args[0].As<Napi::Uint16Array>();
    double range = args[1].As<Napi::Number>().DoubleValue();
    uint32_t groupSize = args[2].As<Napi::Number>(),
        pointCount = points.ElementLength() / 2;

    uint8_t* result = clast::DBSCAN((int16_t*)points.Data(), 
        pointCount, range, groupSize, clusterCount);

    Napi::ArrayBuffer arrayBuffer = Napi::ArrayBuffer::New(env, (void*)result, pointCount * 2, 
        [](Napi::Env env, void* data) { delete[] data; });

    return Napi::Uint8Array::New(env, pointCount * 2, arrayBuffer, 0);
}

Napi::Value k_means(const Napi::CallbackInfo& args) 
{
    Napi::Env env = args.Env();
    
    if (args.Length() < 3) {
        Napi::TypeError::New(env, "Invalid argument count, at least 3 needed").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (!args[0].IsTypedArray() || !args[1].IsNumber() || !args[2].IsString()) {
        Napi::TypeError::New(env, "Invalid arguments").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Uint16Array array = args[0].As<Napi::Uint16Array>();

    int paramCount = args[1].As<Napi::Number>().Int32Value(),
        objCount = array.ElementLength() / paramCount;

    std::string metricName = args[2].As<Napi::String>();

    uint16_t* data = array.Data();
    std::vector<double*> normalized(objCount);
    for (int i = 0; i < objCount; ++i) normalized[i] = new double[paramCount];
    for (int p = 0; p < paramCount; p++)
    {
        uint16_t maxValue = data[p];
        for (int i = p + paramCount; i < objCount * paramCount; i += paramCount) {
            if (data[i] > maxValue) maxValue = data[i];
        }
        for (int i = 0; i < objCount; ++i) {
            normalized[i][p] = (double)data[i * paramCount + p] / maxValue;
        }
    }

    uint8_t clusterCount;
    bool findFlag = true;
    if (args.Length() == 4) if (args[3].IsNumber()) {
        clusterCount = args[3].As<Napi::Number>().Int32Value();
        findFlag = false;
    }

    try {
        uint8_t* result = clast::k_means(normalized, paramCount, 
            metrics::metricFromName(metricName), clusterCount, findFlag);
    
        for (double* obj : normalized) delete[] obj;
        
        return Napi::Uint8Array::New(env, objCount, Napi::ArrayBuffer::New(env, (void*)result, objCount, 
            [](Napi::Env env, void* data) { delete[] data; }), 0);
    } 
    catch (std::string error) {
        Napi::Error::New(env, error).ThrowAsJavaScriptException();
        std::cout << error << '\n';
        return env.Undefined();
    }
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "k_means"), Napi::Function::New(env, k_means));
    exports.Set(Napi::String::New(env, "DBSCAN"), Napi::Function::New(env, DBSCAN));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
