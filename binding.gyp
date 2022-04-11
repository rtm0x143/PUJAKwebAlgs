{
  "targets": [
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "addons/algs",
        "addons/utils"
      ],
      "target_name": "genetic",
      "sources": [ 
        "addons/geneticWrap.cpp",
        "addons/algs/src/Genetic.cpp",
        "addons/utils/src/GeneticRuntime.cpp",
        "addons/utils/src/Graph.cpp",
        "addons/utils/src/tools.cpp"
      ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    },
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "addons/algs",
        "addons/utils"
      ],
      "target_name": "ants",
      "sources": [ 
        "addons/antsWrap.cpp",
        "addons/algs/src/Colony.cpp",
        "addons/utils/src/AntsRuntime.cpp",
        "addons/utils/src/tools.cpp"
      ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    },
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "target_name": "labGen",
      "sources": [ "addons/labGenWrap.cpp" ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    },
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "addons/algs",
        "addons/utils"
      ],
      "target_name": "clasterisation",
      "sources": [ 
        "addons/clasterisationWrapp.cpp", 
        "addons/algs/src/DBSCAN.cpp", 
        "addons/algs/src/k_means.cpp", 
        "addons/algs/src/metrics.cpp" 
        ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    },
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "addons/algs",
        "addons/utils"
      ],
      "target_name": "neuralNetwork",
      "sources": [ 
        "addons/neuralNetWrap.cpp", 
        "addons/utils/src/NetIO.cpp", 
        "addons/utils/src/tools.cpp",
        "addons/algs/src/NeuralNetwork.cpp" 
      ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    },
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")",
        "addons/algs",
        "addons/utils"
      ],
      "target_name": "astar",
      "sources": [ 
        "addons/astarWrap.cpp",
        "addons/algs/src/astar.cpp" 
      ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    }
    ]
}
