#include "napi.h"
#include "clasterisation.h"

Napi::Value DBSCAN(const Napi::CallbackInfo& args) 
{
    Napi::Env env = args.Env();
    
    if (args.Length() < 3) {
        Napi::TypeError::New(env, "Invalid argument count, 3 needed").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (!args[0].IsArrayBuffer() || !args[1].IsNumber() || !args[2].IsNumber()){
        Napi::TypeError::New(env, "Invalid arguments").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    uint8_t clusterCount;
    Napi::ArrayBuffer points = args[0].As<Napi::ArrayBuffer>();
    double range = args[1].As<Napi::Number>().DoubleValue();
    uint32_t groupSize = args[2].As<Napi::Number>(),
        pointCount = points.ByteLength() / 4;

    uint8_t* result = clast::DBSCAN((int16_t*)points.Data(), pointCount, range, groupSize, clusterCount);
    return Napi::ArrayBuffer::New(env, (void*)result, pointCount * 2,
        [](Napi::Env env, void* data) { delete[] data; });
}

Napi::Value k_means(const Napi::CallbackInfo& args) 
{
    Napi::Env env = args.Env();
    
    if (args.Length() < 4) {
        Napi::TypeError::New(env, "Invalid argument count, at least 4 needed").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (!args[0].IsArrayBuffer() || !args[1].IsNumber() || !args[2].IsNumber() || !args[3].IsString()){
        Napi::TypeError::New(env, "Invalid arguments").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    uint8_t clusterCount;
    int objCount = args[1].As<Napi::Number>().Int32Value(), 
        paramCount = args[2].As<Napi::Number>().Int32Value(); 
    std::string metricName = args[3].As<Napi::String>();

    int16_t* data = (int16_t*)args[0].As<Napi::ArrayBuffer>().Data();
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

    bool findFlag = true;
    if (args.Length() == 4) if (args[3].IsNumber()) {
        clusterCount = args[3].As<Napi::Number>().Int32Value();
        findFlag = false;
    }

    uint8_t* result = clast::k_means(normalized, paramCount, 
        metrics::metricFromName(metricName), clusterCount, findFlag);

    for (double* obj : normalized) delete[] obj;

    return Napi::ArrayBuffer::New(env, (void*)result, objCount, 
        [](Napi::Env env, void* data) { delete[] data; });
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "k_means"), Napi::Function::New(env, k_means));
    exports.Set(Napi::String::New(env, "DBSCAN"), Napi::Function::New(env, DBSCAN));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
