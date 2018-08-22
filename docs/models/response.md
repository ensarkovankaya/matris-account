# API Response Model

API can return with three http response *success*, *error* or *server error*.

## Success Response \<T\>

Indicates request completed succesfully.

**Status code:** `200`

```
{
    data: T
}
```

## Error Response

Indicates request can not completed succesfully. 

Returns list of [ValidationError](./validation.error.md).

**Status code:** `400`

```
{
    data: null,
    errors: ValidationError[]
}
```

## Server Error Response

Indicates an unexpected error has occurred.

**Status code:** `500`

```
{
    data: null
}
```
