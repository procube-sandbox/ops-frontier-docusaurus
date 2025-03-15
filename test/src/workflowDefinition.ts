const workflowDefinition = {
    $id: "https://private-schemas.dis.ops-frontier.dev/workflow-definition",
    type: "object",
    title: "ワークフロー定義",
    properties: {
        version: {
            type: "string",
            description: "ワークフロー定義のバージョン",
            title: "バージョン",
        },
        id: {
            type: "string",
            description: "ワークフローID",
            title: "ワークフローID",
        },
        workflow: {
            type: "object",
            title: "ワークフローの定義",
            properties: {
                name: {
                    type: "string",
                    description: "ワークフロー名",
                    title: "ワークフロー名",
                },
                description: {
                    type: "string",
                    description: "ワークフローの説明",
                    title: "説明",
                },
                matchers: {
                    type: "array",
                    title: "マッチャー配列",
                    items: {
                        type: "object",
                        title: "マッチャー",
                        properties: {
                            match: {
                                anyOf: [
                                    {
                                        type: "object",
                                        title: "マッチ条件",
                                        properties: {
                                            category: {
                                                type: ["string", "null"],
                                                description: "情報種別",
                                                title: "情報種別",
                                            },
                                            formatVersion: {
                                                type: ["string", "null"],
                                                description:
                                                    "フォーマットバージョン。npmのセマンティックバージョニングによる照合を行う。参考: https://semver.npmjs.com/",
                                                title: "フォーマットバージョン",
                                            },
                                            dataLabel: {
                                                anyOf: [
                                                    {
                                                        type: "object",
                                                        additionalProperties: {},
                                                        title: "データラベルの条件",
                                                    },
                                                    {
                                                        type: "null",
                                                        title: "Null",
                                                    },
                                                ],
                                                description:
                                                    "データラベル。指定した各プロパティをすべて含む場合にマッチしたとみなされる。",
                                                title: "データラベル",
                                            },
                                        },
                                        additionalProperties: false,
                                    },
                                    {
                                        type: "null",
                                    },
                                ],
                                description:
                                    "ルールのマッチ条件。メッセージメタデータがここで指定したプロパティをすべて含む場合にマッチしたとみなされる。",
                                title: "マッチ条件",
                            },
                            as: {
                                type: ["string", "null"],
                                description:
                                    "マッチした場合に付与されるワークフローファイルラベル。depsにて参照できるようになる。記載しなかった場合、$requestで参照することができる。",
                                default: "$request",
                                title: "As",
                            },
                        },
                        additionalProperties: false,
                    },
                    description:
                        "マッチング条件の配列。複数の条件にマッチした場合、その中で先頭の条件にマッチしたとみなす。",
                },
                masters: {
                    anyOf: [
                        {
                            type: "array",
                            title: "マスター配列",
                            items: {
                                type: "object",
                                title: "マスター",
                                properties: {
                                    as: {
                                        type: "string",
                                        description:
                                            "ワークフロー上でのマスターの名前。ワークフロープロセスコンテキストに登録され、jsonataで参照できるようになる。",
                                        title: "マスター名",
                                    },
                                    path: {
                                        type: "string",
                                        description: "S3/MinIO上でのマスターのファイルパス。",
                                        title: "ファイルパス",
                                    },
                                    ttl: {
                                        type: "number",
                                        description: "マスターのキャッシュの有効期限。単位は秒。",
                                        title: "有効期限",
                                    },
                                },
                                required: ["as", "path", "ttl"],
                                additionalProperties: false,
                            },
                        },
                        {
                            type: "null",
                        },
                    ],
                    description: "マスターの配列",
                },
                tracking: {
                    anyOf: [
                        {
                            anyOf: [
                                {
                                    type: "boolean",
                                    const: true,
                                },
                                {
                                    type: "object",
                                    title: "トラッカー情報",
                                    properties: {
                                        key: {
                                            type: "string",
                                            description:
                                                "待ち合わせ対象を紐付けるための値。${{ }} で囲むことで、jsonata による値の埋め込みが可能。複数の条件を埋め込む場合はjsonataで文字列結合すること。",
                                            title: "キー",
                                        },
                                        idleTimeout: {
                                            type: "string",
                                            description:
                                                "トラッカー最新実行時からのタイムアウト時間。 30日間→30d, 1時間→1h, 30分→30m などの形式で指定する。",
                                            title: "アイドルタイムアウト",
                                        },
                                        maxLifespan: {
                                            type: "string",
                                            description:
                                                "トラッカーが起動してから終了するまでの時間。 30日間→30d, 1時間→1h, 30分→30m などの形式で指定する。",
                                            title: "最大寿命",
                                        },
                                        isPersistent: {
                                            type: "boolean",
                                            default: false,
                                            description: "トラッカーの永続化。trueの場合、トラッカーが永続化される。",
                                            title: "永続化するかどうか",
                                        },
                                    },
                                    required: ["key", "idleTimeout", "maxLifespan"],
                                    additionalProperties: false,
                                },
                            ],
                            description:
                                "トラッカーの定義。trueと記載した場合、シングルトンのトラッカーが作成される。Matcher条件にマッチしたデータが利用できるようになる。",
                            title: "Tracking",
                        },
                        {
                            type: "null",
                        },
                    ],
                    description: "トラッカーの定義",
                },
                cron: {
                    type: ["string", "null"],
                    description: "cronの定義。cronの形式で記載する。",
                    title: "Cron",
                },
                steps: {
                    type: "array",
                    title: "ステップ",
                    items: {
                        $ref: "https://private-schemas.dis.ops-frontier.dev/workflow-step",
                    },
                },
                alertTimeout: {
                    type: ["string", "null"],
                    description: "アラート発行までのタイムアウト時間。",
                    title: "アラートタイムアウト",
                },
            },
            required: ["name", "description", "matchers", "steps"],
            additionalProperties: false,
            description: "ワークフローの定義",
        },
    },
    required: ["version", "id", "workflow"],
    additionalProperties: false,
    description: "ワークフロー定義yamlのスキーマ",
} as const
export default workflowDefinition
