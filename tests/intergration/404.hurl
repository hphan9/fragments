# Check route does not exist
GET http://localhost:8080/no-such-route

# Get back 404
HTTP/1.1 404

[Asserts]
# Check error 
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "not found"
jsonpath "$.error.code" == 404

