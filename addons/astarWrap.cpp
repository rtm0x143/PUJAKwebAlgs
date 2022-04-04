#include "napi.h"
#include "astar.h"

// gets (start{x, y}, end{x, y}, fieldData = Uint8Array[height, width, ...fieldCells...])
// field encoding : 0 - void, 1 - wall; 
// returns ArrayBuffer[yxyxyxyxyxyxyxyxyx...FinalX?_FinalY?xyxyxyxyxy]
//                     ^^^^^^^^^^^^^^^^^^                   ^^^^^^^^
//                      alg's steps                         result path
Napi::Value astar(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 3) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Undefined();
    } 
    else if(!info[0].IsObject() || !info[1].IsObject() || !info[2].IsTypedArray()) {
        Napi::TypeError::New(env, "Invalid arguments type").ThrowAsJavaScriptException();
        return env.Undefined();
    } 

    uint8_t* fieldData = info[2].As<Napi::Uint8Array>().Data();

    uint8_t height = fieldData[0], 
        width = fieldData[1];

    uint8_t** field = (uint8_t**)malloc(height);
    field[0] = fieldData + 2; 
    for (size_t i = 1; i < height; i++)
    {
        field[i] = field[i - 1] + width;
    }
    
    Grid grid(field, width, height);
    grid.printGrid();

    Napi::Object start = info[0].ToObject(),
        end =  info[1].ToObject();

    std::cout << "objects\n";

    PathfinderResult result = Pathfinder::findPath(
        grid, 
        { start.Get('x').ToNumber(), start.Get('y').ToNumber() }, 
        { end.Get('x').ToNumber(), end.Get('y').ToNumber() });

    std::cout << "found\n";

    size_t byteSize = result.stepsAndPath.size();
    uint8_t* normalizedData = (uint8_t*)malloc(byteSize);
    for (size_t i = 0; i < byteSize; ++i)
    {
        normalizedData[i] = result.stepsAndPath[i].y;
        normalizedData[++i] = result.stepsAndPath[i].x;
    }

    free(field);
    return Napi::ArrayBuffer::New(env, (void*)normalizedData, byteSize, 
        [](Napi::Env env, void* data) { delete[] data; });
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "astar"), Napi::Function::New(env, astar));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);