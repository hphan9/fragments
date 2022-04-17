# tests/integration/get-ext-txt-md.hurl
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: text/html
```<p>This is a fragment!</p>```

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

#GET Request no ext
GET {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<p>This is a fragment!</p>"

#GET Request txt 
GET {{url}}.txt
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "<p>This is a fragment!</p>"

#GET Request html
GET {{url}}.html
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<p>This is a fragment!</p>"
