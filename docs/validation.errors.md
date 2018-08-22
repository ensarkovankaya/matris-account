# Validaton Error

Validation Error occurs if given input or argument is not satisfy certain conditions.

## Argument Validation Error

```
{
  [arg: string]: {
    [error: string]: string
  }
}
```

**Example:**
```
{
  "errors": [
    {
      "message": "Argument Validation Error",
      "locations": ...,
      "path": ...,
      "validationErrors": {
        "id": {
          "isMongoId": "id must be a mongodb id"
        }
      }
    }
  ],
  ...
}
```


## **IsMongoId**

Given value is not a mongodb id.

## **IsEmail**

Value is not a valid email format.

## **Length**

Value length not falls in a defined range.

## **isLowercase**

Value not only contains lowercase characters.

## **isAlphanumeric**

Value not contains only letters and numbers.