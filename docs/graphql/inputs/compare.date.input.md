# Compare Date Input

Compare date information for given field. Combine two field such as "gt" and "lt" to make range operations.

```
{
    eq?: Date | null;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
}
```

- `eq`: Date | null. Equal to date or null.

- `gt`: Date. After than date.

- `gte`: Date. After then or equal to date.

- `lt`: Date. Before then date.

- `lte`: Date. Before then or equal to date.
