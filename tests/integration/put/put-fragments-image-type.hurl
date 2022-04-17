# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: image/jpeg
file,./images/flower.jpg;

# We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}/info
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
[Captures]
createdTime : jsonpath "$.fragment.created" 
updatedTime : jsonpath "$.fragment.updated" 
id: jsonpath "$.fragment.id"
ownerId : jsonpath "$.fragment.ownerId"

# PUT fragment
PUT {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: image/jpeg
file,./images/car.jpg;

HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{id}}
jsonpath "$.fragment.ownerId" == {{ownerId}}
jsonpath "$.fragment.created" == {{createdTime}}
jsonpath "$.fragment.updated" != {{updatedTime}}
jsonpath "$.fragment.type" == "image/jpeg"

# Clean test database
DELETE {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
