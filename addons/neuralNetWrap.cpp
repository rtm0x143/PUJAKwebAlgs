#include "napi.h"
#include <fstream>
#include "algs/NeuralNetworkV.h"

double*** downloadWeights(const std::string& path, std::vector<size_t>& dimensions) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);
	
	size_t layCount;
	stream.read((char*)&layCount, sizeof(size_t));
	double*** weights = (double***)malloc((layCount - 1) * sizeof(double**));
	dimensions = std::vector<size_t>(layCount);

	stream.read((char*)dimensions.data(), sizeof(size_t));

	for (size_t l = 1; l < layCount; ++l)
	{
		stream.read((char*)(dimensions.data() + l), sizeof(size_t));

		double** weightsLay = weights[l - 1];
        weightsLay = (double**)malloc(dimensions[l] * sizeof(double*));
        weightsLay[0] = (double*)malloc(dimensions[l] * dimensions[l - 1] * 8);
        for (size_t i = 1; i < dimensions[l]; ++i) {
            weightsLay[i] = weightsLay[i - 1] + dimensions[l - 1];
        }
        
		stream.read((char*)weightsLay[0], dimensions[l] * dimensions[l - 1] * 8);
		
	}
	stream.close();
	return weights;
}

double** downloadBiases(const std::string& path) {
	std::ifstream stream(path, std::ios::in | std::ios::binary);

	size_t count;
	stream.read((char*)&count, sizeof(size_t));
	double** biases = (double**)malloc((count + 1) * sizeof(double*));

	for (size_t l = 1; l <= count; ++l)
	{
		size_t size;
		stream.read((char*)&size, sizeof(size_t));
		biases[l] = (double*)malloc(size * 8);
		stream.read((char*)biases[l], size * 8);
	}

	stream.close();
	return biases;
}

NeuralNetworkV* net = nullptr;

void init(const Napi::CallbackInfo& info) 
{
    Napi::Env env = info.Env();
    
    if (info.Length() != 2) {
        Napi::TypeError::New(env, "Invalid arguments count").ThrowAsJavaScriptException();
        return;
    } else if (!info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Invalid arguments types; string expected").ThrowAsJavaScriptException();
        return;
    }     

    std::vector<size_t> dimensions;
    double*** weights = downloadWeights(info[0].As<Napi::String>(), dimensions);
    double** biases = downloadBiases(info[0].As<Napi::String>());

    net = new NeuralNetworkV(dimensions, weights, biases);
}

Napi::Value feedForward(const Napi::CallbackInfo& info) 
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
    
    double* input = (double*)info[0].As<Napi::ArrayBuffer>().Data();
    Napi::Number result = Napi::Number::New(env, net->FeedForward(input));

    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "feedForward"), Napi::Function::New(env, feedForward));
    exports.Set(Napi::String::New(env, "init"), Napi::Function::New(env, init));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);