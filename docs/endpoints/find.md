# Query: Find

Query users with given filters.

Arguments: 

**Returns**: [List](../models/list.result.md)<[User](../models/user.md)>

## Inputs

- [User Filter Input](../graphql/inputs/user.filter.md)

- [Pagination Input](../graphql/inputs/pagination.md)

## Example

**Request:**
```
curl -X POST \
  http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{
	"query": "query search($role: RoleQuery, $limit: Float) { result: find(filters: {role: $role}, pagination: {limit: $limit}) { docs { _id }, page, pages, limit, total } }",
	"variables": {
		"role": {"eq": "ADMIN"},
		"limit": 5
	}
}'
```

**Response:**

```
{
  "data": {
    "result": {
      "docs": [
        {
          "_id": "5b4b57f3fc13ae17300007ca"
        },
        {
          "_id": "5b4b57f3fc13ae17300008b1"
        },
        {
          "_id": "5b4b57f4fc13ae173000091e"
        },
        {
          "_id": "5b4b57f2fc13ae1730000792"
        },
        {
          "_id": "5b4b57f3fc13ae1730000828"
        }
      ],
      "page": 1,
      "pages": 41,
      "limit": 5,
      "total": 202
    }
  }
}
```