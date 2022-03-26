# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
# We're sending a plain text fragment
Content-Type: image/jpeg
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 415
# We have various assertions about the response that we want to check 
[Asserts]
# The error 
jsonpath "$.status" isString 
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.error.message" isString

