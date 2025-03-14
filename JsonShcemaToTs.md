# jsonSchemaToTs

## 使用方法


##　処理内容

1. 引数に指定されたJSON Schema を読み込み shcema 変数に格納する。
2. $id は kebab-case で指定されているものとし、 basename を CamelCase に変換したものを schemaName 変数に格納し、 PascalCase に変換したものを typeName 変数に格納する
3. 以下のテンプレートに適用して TypeScript のプログラムを生成し、 -o オプションで指定されたファイルに出力する。 -o オプションが指定されていない場合は、入力んとなったJSON Schema の拡張子を .ts に変えてファイルを生成する。

```javascript
import {jsonTransformer} from "@procube/json-transformer"
import type {transformedType} from "@procube/json-transformer"

export const ${schemaName} = ${JSON.stringfy(schema,4)} as const
export const ${typeName} = transformedType<typeof ${schemaName}>


```