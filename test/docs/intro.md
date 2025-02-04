---
sidebar_position: 1
hide_table_of_contents: true
---
# 例
<details><summary>まとめ</summary><div>xxx<br/>yyy</div></details>
:::spec
## A-2-3:OK
PNGタイルが作成され、コンテンツサービスに登録する。
### テスト手順など
#### テスト手順

テスト対象のyaml、file、categoryを指定して、sh $DIR/$｛SOBODEV｝/work/do_curl.sh $FILE $EXT $CATEGORY を実行
#### 期待される結果
 コンテンツサービスにPNGタイルが登録されていることを確認する。
- 指定したズームレベルのPNGタイルが作成されていることを確認する。
- 箇条書き2

## A-2-3:OK
PNGタイルが作成され、コンテンツサービスに登録する。
- 箇条書き
- 箇条書き2
### テスト手順など
テスト対象のyaml、file、categoryを指定して、sh $DIR/$｛SOBODEV｝/work/do_curl.sh $FILE $EXT $CATEGORY を実行
#### 期待される結果
コンテンツサービスにPNGタイルが登録されていることを確認する。
- 指定したズームレベルのPNGタイルが作成されていることを確認する。
:::



## 節


```yaml format_as_test_table
- id: jma-adess-NOWC-sobo
  status: OK
  spec: PNGタイルが作成され、コンテンツサービスに登録する。
  procedure: テスト対象のyaml、file、categoryを指定して、sh $DIR/$｛SOBODEV｝/work/do_curl.sh $FILE $EXT $CATEGORY を実行
  expects: |  
    コンテンツサービスにPNGタイルが登録されていることを確認する。
    ・指定したズームレベルのPNGタイルが作成されていることを確認する。
```
## 