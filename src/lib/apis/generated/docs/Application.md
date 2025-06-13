# Application


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**created_by** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**content** | **string** |  | [default to undefined]
**targets** | [**Array&lt;ApplicationTargetDetail&gt;**](ApplicationTargetDetail.md) |  | [default to undefined]
**tags** | [**Array&lt;Tag&gt;**](Tag.md) |  | [default to undefined]
**partition** | [**Partition**](Partition.md) |  | [default to undefined]

## Example

```typescript
import { Application } from './api';

const instance: Application = {
    id,
    status,
    created_at,
    updated_at,
    created_by,
    title,
    content,
    targets,
    tags,
    partition,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
