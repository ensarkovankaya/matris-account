# GraphQL Error

```
{
    message: string;
    locations: {
        line: number,
        column: number
    }[];
    path: string[]
    validationErrors?: ArgumentValidationError[]
}
```

**message**: String. Error message.

If error is an [ArgumentValidationError](./validation.error.md) message will be "Argument Validation Error".

**path**:

**locations**:

**ValidationErrors:** 
Optional. List of [ArgumentValidationError](./validation.error.md)'s.