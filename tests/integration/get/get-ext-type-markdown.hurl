# tests/integration/get-ext-txt-md.hurl
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: text/markdown
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

#GET .md , .html:  markdown text fragment can be returned as txt, HTML, md 
GET {{url}}.html
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Asserts]
body startsWith "<p>This is a fragment!</p>"

GET {{url}}.txt
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This is a fragment!"

#GET .md , .html:  markdown text fragment can not be returned as image type
GET {{url}}.png
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415

# Clean test database
DELETE {{url}}

