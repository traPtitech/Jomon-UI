# TagsApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getTags**](#gettags) | **GET** /tags | |
|[**postTag**](#posttag) | **POST** /tags | |
|[**putTag**](#puttag) | **PUT** /tags/{tagID} | |
|[**tagsTagIDDelete**](#tagstagiddelete) | **DELETE** /tags/{tagID} | |

# **getTags**
> Array<Tag> getTags()

タグの一覧を返す。

### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

const { status, data } = await apiInstance.getTags();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Tag>**

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

# **postTag**
> Tag postTag(tagInput)

タグを追加する。

### Example

```typescript
import {
    TagsApi,
    Configuration,
    TagInput
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagInput: TagInput; //

const { status, data } = await apiInstance.postTag(
    tagInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagInput** | **TagInput**|  | |


### Return type

**Tag**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 追加に成功した場合。追加されたタグの情報を返す。 |  -  |
|**400** | 不正なリクエスト。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putTag**
> Tag putTag(tagInput)

タグの情報を変更する。accountManager権限が必要。

### Example

```typescript
import {
    TagsApi,
    Configuration,
    TagInput
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagID: string; // (default to undefined)
let tagInput: TagInput; //

const { status, data } = await apiInstance.putTag(
    tagID,
    tagInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagInput** | **TagInput**|  | |
| **tagID** | [**string**] |  | defaults to undefined|


### Return type

**Tag**

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

# **tagsTagIDDelete**
> tagsTagIDDelete()

タグを削除する

### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagID: string; // (default to undefined)

const { status, data } = await apiInstance.tagsTagIDDelete(
    tagID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagID** | [**string**] |  | defaults to undefined|


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
|**200** | 削除に成功した場合。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

