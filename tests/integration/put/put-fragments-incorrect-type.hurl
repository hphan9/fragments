# tests/integration/put-fragments-incorrect-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# PUT fragment
PUT {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: application/json
# Body of the request goes in ```...``` when it's a string
```New Fragment```

HTTP/1.1 400
[Asserts]
jsonpath "$.error.code" == 400
