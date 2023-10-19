# POST product/

## Request:

```
{
    ...,
    info: {
        parameterId: number,
        valueIds: number[],
        valueId: number,
        value: {
            title: string,
            value: string
        }[]
    }[]
}
```

# POST parameter/

## Request:

```
{
    ...,
    info: {
        parameterId: number,
        valueIds: number[],
        valueId: number,
        value: string
    }[]
}
```

# PUT parameter/

## Request:

```
{
    ...,
    info: {
        parameterId: number,
        valueIds: number[],
        valueId: number,
        value: string
    }[]
}
```

## Response:

```
{
    type: "ERROR" | "WARNING" | "SUCCESS",
    message: string
}
```