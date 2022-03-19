#include "napi.h"
#include "algs/src/labgen.cpp"

Napi::Value labGen(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Function requires 1 argument").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    Napi::Object dims = info[0].As<Napi::Object>();
    if (!dims.Has("width") || !dims.Has("height")) {
        Napi::TypeError::New(env, "Invalid argument, {width, height} required").ThrowAsJavaScriptException();
         return env.Undefined();
    }
    int width = dims.Get("width").As<Napi::Number>(),
        heigth = dims.Get("height").As<Napi::Number>();

    uint8_t** data = labirint::generateLabirint(width, heigth);

    Napi::ArrayBuffer* buffers = new Napi::ArrayBuffer[heigth];
    for (int i = 0; i < heigth; ++i) {
        buffers[i] = Napi::ArrayBuffer::New(env, data[i], width,
                [](Napi::Env env, void* data) { delete[] data; });
    }

    Napi::Object result = Napi::Object::New(env);
    for (int i = 0; i < heigth; ++i) {
        result.Set(i, buffers[i]);
    } 
    
    delete[] buffers;
    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "labGen"), Napi::Function::New(env, labGen));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);