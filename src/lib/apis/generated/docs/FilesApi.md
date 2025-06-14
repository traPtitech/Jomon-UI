# FilesApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteFile**](#deletefile) | **DELETE** /files/{fileID} | |
|[**getFile**](#getfile) | **GET** /files/{fileID} | |
|[**getFileMeta**](#getfilemeta) | **GET** /files/{fileID}/meta | |
|[**postFile**](#postfile) | **POST** /files | |

# **deleteFile**
> deleteFile()

指定したidのファイルを削除する。accountManager権限または作成者権限が必要。

### Example

```typescript
import {
    FilesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FilesApi(configuration);

let fileID: string; // (default to undefined)

const { status, data } = await apiInstance.deleteFile(
    fileID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileID** | [**string**] |  | defaults to undefined|


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
|**204** | 正常に取り消すことができた場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |
|**500** | サーバーエラー。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFile**
> File getFile()

指定されたファイルを返す

### Example

```typescript
import {
    FilesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FilesApi(configuration);

let fileID: string; // (default to undefined)

const { status, data } = await apiInstance.getFile(
    fileID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileID** | [**string**] |  | defaults to undefined|


### Return type

**File**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/octet-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 該当するファイルが存在した 返す |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |
|**304** | Not Modified |  -  |
|**500** | サーバーエラー。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFileMeta**
> FileMeta getFileMeta()

指定されたファイルのメタデータを返す

### Example

```typescript
import {
    FilesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FilesApi(configuration);

let fileID: string; // (default to undefined)

const { status, data } = await apiInstance.getFileMeta(
    fileID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileID** | [**string**] |  | defaults to undefined|


### Return type

**FileMeta**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 該当するファイルのメタデータが存在した 返す |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |
|**500** | サーバーエラー。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postFile**
> PostFile200Response postFile()

ファイルをアップロードする。

### Example

```typescript
import {
    FilesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FilesApi(configuration);

let file: File; // (default to undefined)
let name: string; // (default to undefined)
let applicationId: string; // (default to undefined)

const { status, data } = await apiInstance.postFile(
    file,
    name,
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] |  | defaults to undefined|
| **name** | [**string**] |  | defaults to undefined|
| **applicationId** | [**string**] |  | defaults to undefined|


### Return type

**PostFile200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 変更に成功した場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

