# PUT fragment
PUT http://localhost:8080/v1/fragments/incorrectId
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: application/json
# Body of the request goes in ```...``` when it's a string
```New Fragment```

HTTP/1.1 404
[Asserts]
jsonpath "$.error.code" == 404
