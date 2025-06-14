# TagsApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getTag**](#gettag) | **GET** /tags/{tagID} | |
|[**getTags**](#gettags) | **GET** /tags | |
|[**postTag**](#posttag) | **POST** /tags | |
|[**tagsTagIDDelete**](#tagstagiddelete) | **DELETE** /tags/{tagID} | |

# **getTag**
> GetTag200Response getTag()

タグの情報を取得する。

### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagID: string; // (default to undefined)

const { status, data } = await apiInstance.getTag(
    tagID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagID** | [**string**] |  | defaults to undefined|


### Return type

**GetTag200Response**

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
> Tag postTag(postTag)

タグを追加する。

### Example

```typescript
import {
    TagsApi,
    Configuration,
    PostTag
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let postTag: PostTag; //

const { status, data } = await apiInstance.postTag(
    postTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postTag** | **PostTag**|  | |


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

