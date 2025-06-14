# PartitionsApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deletePartition**](#deletepartition) | **DELETE** /partitions/{partitionID} | |
|[**getPartition**](#getpartition) | **GET** /partitions/{partitionID} | |
|[**getPartitions**](#getpartitions) | **GET** /partitions | |
|[**postPartition**](#postpartition) | **POST** /partitions | |
|[**putPartition**](#putpartition) | **PUT** /partitions/{partitionID} | |

# **deletePartition**
> deletePartition()

パーティションを削除する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionID: string; // (default to undefined)

const { status, data } = await apiInstance.deletePartition(
    partitionID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionID** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 削除に成功した場合 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPartition**
> Partition getPartition()

パーティションの情報を返す。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionID: string; // (default to undefined)

const { status, data } = await apiInstance.getPartition(
    partitionID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionID** | [**string**] |  | defaults to undefined|


### Return type

**Partition**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得に成功した場合。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPartitions**
> Array<Partition> getPartitions()

パーティションの一覧を返す。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

const { status, data } = await apiInstance.getPartitions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Partition>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得に成功した場合。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postPartition**
> Partition postPartition(postPartition)

パーティションを追加する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PostPartition
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let postPartition: PostPartition; //

const { status, data } = await apiInstance.postPartition(
    postPartition
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postPartition** | **PostPartition**|  | |


### Return type

**Partition**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 追加に成功した場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putPartition**
> Partition putPartition(postPartition)

パーティションの情報を変更する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PostPartition
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionID: string; // (default to undefined)
let postPartition: PostPartition; //

const { status, data } = await apiInstance.putPartition(
    partitionID,
    postPartition
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postPartition** | **PostPartition**|  | |
| **partitionID** | [**string**] |  | defaults to undefined|


### Return type

**Partition**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 変更に成功した場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

