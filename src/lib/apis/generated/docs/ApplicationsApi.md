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
> ApplicationDetail postApplication(postApplication)

申請を新規作成する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    PostApplication
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let postApplication: PostApplication; //

const { status, data } = await apiInstance.postApplication(
    postApplication
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postApplication** | **PostApplication**|  | |


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
> Comment postComment(postComment)

指定した申請にコメントを新規作成する。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    PostComment
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let postComment: PostComment; //

const { status, data } = await apiInstance.postComment(
    applicationID,
    postComment
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postComment** | **PostComment**|  | |
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
> ApplicationDetail putApplicationDetail(postApplication)

指定した申請を修正する。作成者権限が必要。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    PostApplication
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let postApplication: PostApplication; //

const { status, data } = await apiInstance.putApplicationDetail(
    applicationID,
    postApplication
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postApplication** | **PostApplication**|  | |
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
> StatusDetail putStatus(putStatus)

指定した申請のstatusを変更のみ(新規はpost /applications)する。commentは常に必須(ないときは空文字列)。statusの行き来の定義は作成者は「change_requestedからsubmitted」をでき、accountManagerは「submittedからrejected」「submittedからchange_requested」「change_requestedからsubmitted」「submittedからapproved」「approvedからsubmitted（ただしすでに支払われている人がいた場合、この操作は不可)」の操作のみ可。ただし、「approvedからfully_repaid」の操作はここでは行えない。accountManager権限または作成者権限が必要。

### Example

```typescript
import {
    ApplicationsApi,
    Configuration,
    PutStatus
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationID: string; // (default to undefined)
let putStatus: PutStatus; //

const { status, data } = await apiInstance.putStatus(
    applicationID,
    putStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **putStatus** | **PutStatus**|  | |
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

