---
sidebar_position: 1
---
# 例

```typescript
test=5
```

```yaml format_as_test_table
- id: jma-adess-NOWC-sobo
  status: OK
  spec: PNGタイルが作成され、コンテンツサービスに登録する。
  procedure: テスト対象のyaml、file、categoryを指定して、sh $DIR/$｛SOBODEV｝/work/do_curl.sh $FILE $EXT $CATEGORY を実行
  expects: |  
    コンテンツサービスにPNGタイルが登録されていることを確認する。
    ・指定したズームレベルのPNGタイルが作成されていることを確認する。
```
