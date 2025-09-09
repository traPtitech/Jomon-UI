# PartitionsApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deletePartition**](#deletepartition) | **DELETE** /partitions/{partitionID} | |
|[**deletePartitionGroup**](#deletepartitiongroup) | **DELETE** /partition-groups/{partitionGroupID} | |
|[**getPartition**](#getpartition) | **GET** /partitions/{partitionID} | |
|[**getPartitionGroup**](#getpartitiongroup) | **GET** /partition-groups/{partitionGroupID} | |
|[**getPartitionGroups**](#getpartitiongroups) | **GET** /partition-groups | |
|[**getPartitions**](#getpartitions) | **GET** /partitions | |
|[**postPartition**](#postpartition) | **POST** /partitions | |
|[**postPartitionGroup**](#postpartitiongroup) | **POST** /partition-groups | |
|[**putPartition**](#putpartition) | **PUT** /partitions/{partitionID} | |
|[**putPartitionGroup**](#putpartitiongroup) | **PUT** /partition-groups/{partitionGroupID} | |

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

# **deletePartitionGroup**
> deletePartitionGroup()

パーティショングループを削除する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionGroupID: string; // (default to undefined)

const { status, data } = await apiInstance.deletePartitionGroup(
    partitionGroupID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionGroupID** | [**string**] |  | defaults to undefined|


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

# **getPartitionGroup**
> PartitionGroup getPartitionGroup()

パーティショングループの情報を返す。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionGroupID: string; // (default to undefined)

const { status, data } = await apiInstance.getPartitionGroup(
    partitionGroupID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionGroupID** | [**string**] |  | defaults to undefined|


### Return type

**PartitionGroup**

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

# **getPartitionGroups**
> Array<PartitionGroup> getPartitionGroups()

パーティショングループの一覧を返す。

### Example

```typescript
import {
    PartitionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

const { status, data } = await apiInstance.getPartitionGroups();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PartitionGroup>**

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
> Partition postPartition(partitionInput)

パーティションを追加する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PartitionInput
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionInput: PartitionInput; //

const { status, data } = await apiInstance.postPartition(
    partitionInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionInput** | **PartitionInput**|  | |


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

# **postPartitionGroup**
> PartitionGroup postPartitionGroup(partitionGroupInput)

パーティショングループを追加する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PartitionGroupInput
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionGroupInput: PartitionGroupInput; //

const { status, data } = await apiInstance.postPartitionGroup(
    partitionGroupInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionGroupInput** | **PartitionGroupInput**|  | |


### Return type

**PartitionGroup**

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
> Partition putPartition(partitionInput)

パーティションの情報を変更する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PartitionInput
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionID: string; // (default to undefined)
let partitionInput: PartitionInput; //

const { status, data } = await apiInstance.putPartition(
    partitionID,
    partitionInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionInput** | **PartitionInput**|  | |
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

# **putPartitionGroup**
> PartitionGroup putPartitionGroup(partitionGroupInput)

パーティショングループの情報を変更する。accountManager権限が必要。

### Example

```typescript
import {
    PartitionsApi,
    Configuration,
    PartitionGroupInput
} from './api';

const configuration = new Configuration();
const apiInstance = new PartitionsApi(configuration);

let partitionGroupID: string; // (default to undefined)
let partitionGroupInput: PartitionGroupInput; //

const { status, data } = await apiInstance.putPartitionGroup(
    partitionGroupID,
    partitionGroupInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partitionGroupInput** | **PartitionGroupInput**|  | |
| **partitionGroupID** | [**string**] |  | defaults to undefined|


### Return type

**PartitionGroup**

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

