{
  "targets": [
    {
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "target_name": "labGen",
      "sources": [ "src/cpp/labGenWrap.cpp" ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    }
    # {
    #   "include_dirs" : [
    #     "<!@(node -p \"require('node-addon-api').include\")"
    #   ],
    #   "target_name": "test",
    #   "sources": [ "src/cpp/test.cpp" ],
    #   'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    # }
    ]
}
