#include "napi.h"
#include <fstream>
#include "NeuralNetwork.h"
#include "tools.h"
#include "NetIO.h"

#include <iostream>
#include "vectorExtention.cpp"
using namespace vectorExtention;

NeuralNetwork* net = nullptr;

void init(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    std::cout << (std::string)info[0].ToString() << ' ' << (std::string)info[1].ToString() << '\n';
    if (info.Length() != 2) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return;
    } else if (!info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Invalid arguments types; string expected").ThrowAsJavaScriptException();
        return;
    }

    std::vector<size_t> dimensions;
    Matrix<double>* weights = NetIO::downloadWeights(info[0].As<Napi::String>(), dimensions);
    std::vector<double>* biases = NetIO::downloadBiases(info[1].As<Napi::String>());

    delete net;
    net = new NeuralNetwork(dimensions, weights, biases, tools::sigmoid, tools::derSigByValue);
}

Napi::Value findDigit(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    if (!net) {
        Napi::Error::New(env, "Neural network haven't beed initialized; initialize before use");
        return env.Null();
    } else if (info.Length() != 1) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return env.Null();
    } else if (!info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Invalid arguments types; TypedArray expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::Uint8Array img = info[0].As<Napi::Uint8Array>();
    if (img.ByteLength() != 10000) {
        Napi::Error::New(env, "Invalid image size").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::vector<double> normalized = tools::normalizeRGBA_Img((uint8_t*)img.Data(), img.ByteLength() / 4);
    Napi::Number result = Napi::Number::New(env, (int)net->feedForward(normalized));

    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "findDigit"), Napi::Function::New(env, findDigit));
    exports.Set(Napi::String::New(env, "init"), Napi::Function::New(env, init));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);