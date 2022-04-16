#include "napi.h"
#include "astar.h"

// gets (start{x, y}, end{x, y}, fieldData = Uint8Array[height, width, ...fieldCells...])
// field encoding : 0 - void, 1 - wall; 
// returns ArrayBuffer[yxyxyxyxyxyxyxyxyx...FinalY?_FinalX?yxyxyxyx]
//                     ^^^^^^^^^^^^^^^^^^                   ^^^^^^^^
//                      alg's steps                         result path
Napi::Value astar(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 5) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    else if(!info[0].IsObject() || !info[1].IsObject() 
        || !info[2].IsObject() || !info[3].IsTypedArray() || !info[4].IsString()) 
    {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Object dims = info[2].ToObject();
    int height = dims.Get("height").ToNumber(), 
        width = dims.Get("width").ToNumber();

    uint8_t** field = new uint8_t*[height];
    field[0] = info[3].As<Napi::Uint8Array>().Data();; 
    for (size_t i = 1; i < height; i++)
    {
        field[i] = field[i - 1] + width;
    }
    
    Grid grid(field, width, height);

    Napi::Object start = info[0].ToObject(),
        end =  info[1].ToObject();

    Pathfinder pathFinder(metricsV::metricFromName(info[4].ToString()));
    PathfinderResult result = pathFinder.findPath(
        grid, 
        { start.Get("x").ToNumber().Int32Value(), start.Get("y").ToNumber().Int32Value() }, 
        { end.Get("x").ToNumber().Int32Value(), end.Get("y").ToNumber().Int32Value() });

    size_t byteSize = result.stepsAndPath.size() * 2;
    uint8_t* normalizedData = (uint8_t*)malloc(byteSize);
    for (size_t i = 0; i < byteSize; ++i)
    {
        normalizedData[i] = result.stepsAndPath[i / 2].y;
        normalizedData[++i] = result.stepsAndPath[i / 2].x;
    }

    delete[] field;
    return Napi::ArrayBuffer::New(env, (void*)normalizedData, byteSize, 
        [](Napi::Env env, void* data) { delete[] data; });
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "astar"), Napi::Function::New(env, astar));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
