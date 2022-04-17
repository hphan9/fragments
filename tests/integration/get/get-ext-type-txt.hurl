# tests/integration/get-ext-type-txt.hurl
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: text/plain; charset=utf-8
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

#GET .md , .html plain text fragment cannot be returned as markdown, HTML or image.
GET {{url}}.md
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Can not convert text/plain; charset=utf-8 to the request extension"

GET {{url}}.html
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415

GET {{url}}.png
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415

# Clean test database
DELETE {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

