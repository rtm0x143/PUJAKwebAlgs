{
  "targets": [
    { 
     "cflags!": [ "" ],
     #"cflags_cc!": [ "-fno-exceptions" ],
      "include_dirs" : [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "target_name": "addon",
      "sources": [ "addon.cpp" ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
    }
  ]
}
