# tests/integration/post-fragments-json.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
# We're sending a plain text fragment
Content-Type: application/json
{"data":"This is a fragment!"}

HTTP/1.1 201
[Captures]
url: header "Location"

# GET extension 
GET {{url}}.txt
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "{\"data\":\"This is a fragment!\"}"

GET {{url}}.json
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: application/json
[Asserts]
jsonpath "$.data" == "This is a fragment!"

# invalid extenstion
GET {{url}}.wrong
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415

# Clean test database
DELETE {{url}}
