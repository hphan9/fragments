# lab-9 s3 test
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8
# Body of the request goes in ```...``` when it's a string
```Hello S3!```

# the server returns a 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# GET the fragment just created
GET {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

# the server returns a 200
HTTP/1.1 200

# Check the response
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Hello S3!"

# Delete test
DELETE {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

# the server returns a 200
HTTP/1.1 200

# GET the fragment just deleted
GET {{url}}
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

# the server returns a 200
HTTP/1.1 404

