# tests/integration/get-ext-type-png.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user2@email.com:password2
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==
Content-Type: image/webp
file,./images/house.webp;

HTTP/1.1 201

[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL and valid extension
#gif
GET {{url}}.gif
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: image/gif

# .jpg
GET {{url}}.jpg
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: image/jpeg

#webp
#gif
GET {{url}}.webp
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 200
Content-Type: image/webp


# html
GET {{url}}.html
Authorization: Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==

HTTP/1.1 415


