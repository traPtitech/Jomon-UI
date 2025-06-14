# AccountManagersApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteAccountManagers**](#deleteaccountmanagers) | **DELETE** /account-managers | |
|[**getAccountManagers**](#getaccountmanagers) | **GET** /account-managers | |
|[**postAccountManagers**](#postaccountmanagers) | **POST** /account-managers | |

# **deleteAccountManagers**
> deleteAccountManagers(requestBody)

accountManagerユーザーを削除する。accountManager権限が必要。

### Example

```typescript
import {
    AccountManagersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountManagersApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.deleteAccountManagers(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 削除できた場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAccountManagers**
> Array<string> getAccountManagers()

accountManagerユーザーの一覧を返す。accountManager権限が必要。

### Example

```typescript
import {
    AccountManagersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountManagersApi(configuration);

const { status, data } = await apiInstance.getAccountManagers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<string>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得に成功した場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAccountManagers**
> postAccountManagers(requestBody)

accountManagerユーザーを追加する。accountManager権限が必要。

### Example

```typescript
import {
    AccountManagersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountManagersApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.postAccountManagers(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 追加に成功した場合。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

