# Pagination Input Model

```
{
    page?: number;
    offset?: number;
    limit?: number;
}
```

- `page`: Default *1*. Requested page number. Minimum 1, maximum 9999.

- `offset`: Default *0*.

- `limit`: Default *10*. Maximum number of documents per page.

    Can be one of *5*, *10*, *25*, *50*, *100* or *150*.