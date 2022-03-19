{
  "targets": [
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
        "addons/algs"
      ],
      "target_name": "clasterisation",
      "sources": [ "addons/clasterisationWrapp.cpp", "addons/algs/src/DBSCAN.cpp", "addons/algs/src/k_means.cpp", "addons/algs/src/metrics.cpp" ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    }
    # {
    #   "include_dirs" : [
    #     "<!@(node -p \"require('node-addon-api').include\")"
    #   ],
    #   "target_name": "test",
    #   "sources": [ "addons/test.cpp" ],
    #   'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    # }
    ]
}
