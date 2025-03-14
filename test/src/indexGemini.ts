import Ajv, { JSONSchemaType } from "ajv"

// スキーマ定義
const schema: JSONSchemaType<any> = {
    type: "object",
    properties: {
        timestamp: {
            type: "integer",
            "epoch-unit": "sec", // 秒単位のUNIX時間を指定
        },
        timestamps: {
            type: "array",
            items: {
                type: "integer",
                "epoch-unit": "sec",
            },
        },
    },
    required: ["timestamp", "timestamps"],
}

// Ajvインスタンスの作成
const ajv = new Ajv({ coerceTypes: true })

// カスタムキーワード'epoch-unit'の追加
ajv.addKeyword({
    keyword: "epoch-unit",
    type: "integer", // coerceは型を指定する必要がある
    coerce: (data: any, dataPath: string, parentData: any, propertyName: string) => {
        if (ajv.getKeyword("epoch-unit").definition.schema === "sec" && typeof data === "number") {
            // 秒単位のUNIX時間として解釈し、Dateに変換
            const date = new Date(data * 1000)
            return date
        }
        return data
    },
})

// validate関数の生成
const validate = ajv.compile(schema)

// テストデータ
const data = {
    timestamp: 1678886400, // 2023年3月15日 0:00:00 UTCのUNIX時間（秒）
    timestamps: [1678886400, 1678972800],
}

// バリデーションの実行
if (validate(data)) {
    console.log("バリデーション成功:", data.timestamp, data.timestamps) // Dateオブジェクトが出力される
} else {
    console.log("バリデーション失敗:", validate.errors)
}
