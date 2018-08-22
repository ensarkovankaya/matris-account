# Query: Get

Get user account information by one of given argument.

Returns: [User](../models/user.md) | null.

## Arguments

```
{
    id?: string;
    email?: string;
    username?: string;
}
```

- `id`: String. User id.

- `email`: String. User email.

- `username`: String. User username.


## Exceptions

- [ParameterRequired](../graphql/exceptions/parameter.required.md): If none of id, email or username is given.

## Validation Errors

- `id`
    - [isMongoId](../validation.errors.md#ismongoid)
- `email`
    - [isEmail](../validation.errors.md#isemail)
- `username`
    - [length](../validation.errors.md#length)
    - [isLowercase](../validation.errors.md#isLowercase)
    - [isAlphanumeric](../validation.errors.md#isAlphanumeric)

## Example

**Request:**

```
curl -X POST \
  http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{
	"query": "query getUser($id: String) { user: get(id: $id) { firstName, lastName } }",
	"variables": {
		"id": "5b4b57f3fc13ae1730000828"
	}
}'
```

**Response:**

```
{
    "data": {
        "user": {
            "firstName": "Clemence",
            "lastName": "Wyllie"
        }
    }
}
```