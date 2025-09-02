# ApplicationDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**status** | [**StatusEnum**](StatusEnum.md) |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**content** | **string** |  | [default to undefined]
**created_by** | **string** |  | [default to undefined]
**comments** | [**Array&lt;Comment&gt;**](Comment.md) |  | [default to undefined]
**files** | **Array&lt;string&gt;** |  | [default to undefined]
**statuses** | [**Array&lt;Status&gt;**](Status.md) |  | [default to undefined]
**tags** | [**Array&lt;Tag&gt;**](Tag.md) |  | [default to undefined]
**partition** | [**Partition**](Partition.md) |  | [default to undefined]
**targets** | [**Array&lt;ApplicationTarget&gt;**](ApplicationTarget.md) |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]

## Example

```typescript
import { ApplicationDetail } from './api';

const instance: ApplicationDetail = {
    id,
    status,
    title,
    content,
    created_by,
    comments,
    files,
    statuses,
    tags,
    partition,
    targets,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
