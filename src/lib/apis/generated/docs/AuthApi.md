# AuthApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**beginAuth**](#beginauth) | **GET** /auth/signin | |

# **beginAuth**
> beginAuth()

PKCEを取得する｡

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.beginAuth();
```

### Parameters
This endpoint does not have any parameters.


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
|**302** | 取得できた場合｡traQのoauthページにリダイレクトされる。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

