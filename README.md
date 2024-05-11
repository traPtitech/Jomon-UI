<div align="center">
  <h1>Jomon UI</h1>
  <p>
    <strong>An accounting support system's UI</strong>
  </p>
  <p>
    <a href="https://apis.trap.jp/?urls.primaryName=Jomon%20v2%20API">Jomon API</a>&emsp;<a href="https://github.com/traPtitech/Jomon">Jomon Backend</a>
  </p>
  <p>
    <a href="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml"><img src="https://github.com/traPtitech/Jomon-UI/actions/workflows/main.yml/badge.svg"></a>
  </p>
</div>

# Get started

- Prerequisites
  - JVM for OpenAPI Generator
  - node 20.x

```sh
npm install
npm run dev
```

## featuresディレクトリについて

各featureについて、ディレクトリを設けています。
参考: <https://zenn.dev/knowledgework/articles/91a3dd575f99a2>
selectorは現状storeに置くことで済ませています

- model
  - featureに関連する型を定義します
- repository
  - openapiから生成されたapiを用いた通信と、後述のconverterを用いたデータの変換をします
- usecase
  - 実際に使うときの処理です
- converter
  - openapiから生成されたサーバーの型とフロントで扱う型の相互変換をします
  - 今はseedからseedDataへの変換はここに書かずにrepositoryで直接書いてしまっています
- mock
  - mswで使うためのmockデータとmock handlerを定義します

データの型の流れ

- GET
  - 生成された型→(converter)→modelの型
- POST, PUT
  - modelのseed型→(repositoryで変換)→openapiの型
