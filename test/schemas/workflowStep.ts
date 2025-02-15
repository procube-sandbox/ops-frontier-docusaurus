const workflowStep = {
    "$id": "https://private-schemas.dis.ops-frontier.dev/workflow-step",
    "type": "object",
    "title": "Step",
    "properties": {
        "name": {
            "type": "string",
            "description": "ステップ名",
            "title": "ステップ名"
        },
        "deps": {
            "type": "array",
            "title": "Dependencies",
            "items": {
                "type": "string",
                "description": "ファイルラベル。定義yaml上でのファイルの名前",
                "title": "依存"
            },
            "description": "依存する出力の名前"
        },
        "outs": {
            "type": "array",
            "title": "Outputs",
            "items": {
                "type": "string",
                "description": "ファイルラベル。定義yaml上でのファイルの名前",
                "title": "出力"
            },
            "description": "出力するものの名前"
        },
        "module": {
            "type": "object",
            "title": "モジュール",
            "properties": {
                "package": {
                    "type": "string",
                    "description": "呼び出すnpmパッケージ名",
                    "title": "パッケージ名"
                },
                "version": {
                    "type": ["string", "null"],
                    "description": "呼び出すnpmパッケージのバージョン。package.jsonのsemverと同様の形式で入力すること。現在ワークフローエンジンにインストールされているものか、なければ最新のものを利用する。",
                    "title": "バージョン"
                },
                "name": {
                    "type": "string",
                    "description": "呼び出す関数名",
                    "title": "関数名"
                }
            },
            "required": ["package", "name"],
            "additionalProperties": false,
            "description": "呼び出す関数の情報"
        },
        "params": {
            "anyOf": [
                {
                    "type": "object",
                    "additionalProperties": {},
                    "title": "Params Object"
                },
                {
                    "type": "null"
                }
            ],
            "description": "呼び出す関数に渡すパラメータ。jsonataを利用した値を埋め込むことができる。",
            "title": "パラメータ"
        }
    },
    "required": ["name", "deps", "outs", "module"],
    "additionalProperties": false,
    "description": "ワークフローのステップの配列である。先頭から順にモジュールが処理される。"
} as const
export default workflowStep
