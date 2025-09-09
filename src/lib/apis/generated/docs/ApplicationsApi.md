# ApplicationsApi

All URIs are relative to *https://raw.githubusercontent.com/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getApplicationDetail**](#getapplicationdetail) | **GET** /applications/{applicationID} | |
|[**getApplications**](#getapplications) | **GET** /applications | |
|[**postApplication**](#postapplication) | **POST** /applications | |
|[**postComment**](#postcomment) | **POST** /applications/{applicationID}/comments | |
|[**putApplicationDetail**](#putapplicationdetail) | **PUT** /applications/{applicationID} | |
|[**putStatus**](#putstatus) | **PUT** /applications/{applicationID}/status | |

# **getApplicationDetail**
> ApplicationDetail getApplicationDetail()

指定した申請の詳細を取得する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)

const { status, data } = await apiInstance.getApplicationDetail(
    applicationID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationID** | [**string**] |  | defaults to undefined|


### Return type

**ApplicationDetail**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | あったら返す。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getApplications**
> Array<Application> getApplications()

申請一覧を取得する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let sort: string; //並び順 (作成日時が新しい \"created_at\", 作成日時が古い \"-created_at\", タイトルの昇順 \"title\", タイトルの降順 \"-title\") (optional) (default to undefined)
let status: StatusEnum; //現在の状態 (optional) (default to undefined)
let target: string; //誰との取引か (optional) (default to undefined)
let since: string; //いつからの依頼か (optional) (default to undefined)
let until: string; //いつまでの依頼か (optional) (default to undefined)
let limit: number; //取得する最大個数 (optional) (default to 100)
let offset: number; //スキップする個数 (optional) (default to 0)
let tag: string; //タグ(複数の場合カンマ区切り) (optional) (default to undefined)
let partition: string; //パーティション (optional) (default to undefined)
let createdBy: string; //作成者 (optional) (default to undefined)

const { status, data } = await apiInstance.getApplications(
    sort,
    status,
    target,
    since,
    until,
    limit,
    offset,
    tag,
    partition,
    createdBy
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sort** | [**string**] | 並び順 (作成日時が新しい \&quot;created_at\&quot;, 作成日時が古い \&quot;-created_at\&quot;, タイトルの昇順 \&quot;title\&quot;, タイトルの降順 \&quot;-title\&quot;) | (optional) defaults to undefined|
| **status** | **StatusEnum** | 現在の状態 | (optional) defaults to undefined|
| **target** | [**string**] | 誰との取引か | (optional) defaults to undefined|
| **since** | [**string**] | いつからの依頼か | (optional) defaults to undefined|
| **until** | [**string**] | いつまでの依頼か | (optional) defaults to undefined|
| **limit** | [**number**] | 取得する最大個数 | (optional) defaults to 100|
| **offset** | [**number**] | スキップする個数 | (optional) defaults to 0|
| **tag** | [**string**] | タグ(複数の場合カンマ区切り) | (optional) defaults to undefined|
| **partition** | [**string**] | パーティション | (optional) defaults to undefined|
| **createdBy** | [**string**] | 作成者 | (optional) defaults to undefined|


### Return type

**Array<Application>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取得できた場合。該当するものがなくても空配列を返す。 |  -  |
|**400** | 不正なリクエスト。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postApplication**
> ApplicationDetail postApplication(applicationInput)

申請を新規作成する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    ApplicationInput
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationInput: ApplicationInput; //

const { status, data } = await apiInstance.postApplication(
    applicationInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationInput** | **ApplicationInput**|  | |


### Return type

**ApplicationDetail**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 作成できた場合。作成された申請の詳細を返す。 |  -  |
|**400** | 不正なリクエスト。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postComment**
> Comment postComment(commentInput)

指定した申請にコメントを新規作成する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    CommentInput
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let commentInput: CommentInput; //

const { status, data } = await apiInstance.postComment(
    applicationID,
    commentInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentInput** | **CommentInput**|  | |
| **applicationID** | [**string**] |  | defaults to undefined|


### Return type

**Comment**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | OK |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putApplicationDetail**
> ApplicationDetail putApplicationDetail(applicationInput)

指定した申請を修正する。作成者権限が必要。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    ApplicationInput
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let applicationInput: ApplicationInput; //

const { status, data } = await apiInstance.putApplicationDetail(
    applicationID,
    applicationInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationInput** | **ApplicationInput**|  | |
| **applicationID** | [**string**] |  | defaults to undefined|


### Return type

**ApplicationDetail**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 修正できた場合。修正後の詳細を返す。 |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**403** | 編集権限がない人による操作。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putStatus**
> StatusDetail putStatus(statusInput)

指定した申請のstatusを変更のみ(新規はpost /applications)する。commentは常に必須(ないときは空文字列)。statusの変更は、作成者は\"change_requested -> pending_review\"のみが可能、accountManagerはpayment_finishedを除く任意の状態間で可能。ただしapprovedからの変更は、すでに支払われている人がいた場合不可。payment_finishedへの変更は全ての支払い対象者への支払いが完了した場合に自動で行われる。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    StatusInput
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let statusInput: StatusInput; //

const { status, data } = await apiInstance.putStatus(
    applicationID,
    statusInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **statusInput** | **StatusInput**|  | |
| **applicationID** | [**string**] |  | defaults to undefined|


### Return type

**StatusDetail**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | 不正なリクエスト。 |  -  |
|**404** | 指定したリソースは存在しない。 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

