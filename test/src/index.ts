import { FromSchema, JSONSchema } from "json-schema-to-ts"
import Ajv from "ajv"
const ajv = new Ajv()
ajv.addKeyword({
    keyword: "toDate",
    modifying: true,
    validate: function (schema, data, parentSchema, dataCxt) {
        if (schema && typeof data === "string") {
            const parsedDate = new Date(data)
            if (!isNaN(parsedDate.getTime()) && dataCxt) {
                // 親データオブジェクトを更新
                dataCxt.parentData[dataCxt.parentDataProperty] = parsedDate
            }
        }
        return true
    },
})

import workflowDefinition from "./workflowDefinition"
import workflowStep from "./workflowStep"
import { JSONSchemaReference } from "json-schema-to-ts/lib/types/definitions"


type Email = string & { brand: "email" }

export type Desirialize = [
    {
        pattern: {
            type: "string"
            format: "email"
        }
        output: Email
    },
    {
        pattern: {
            type: "string"
            format: "date-time"
            toDate: true
        }
        output: Date
    },
]

type transformedType<T extends JSONSchema, R extends JSONSchemaReference[]> = FromSchema<
    T,
    {
        references: R
        deserialize: Desirialize
    }
>

type WorkflowDefinition = transformedType<typeof workflowDefinition, [typeof workflowStep]>

const validate = ajv.compile(workflowDefinition)

export default function validateAndCoercingWorkflowDefinition(x: any): WorkflowDefinition {
    if (!validate(x)) {
        throw Error(`Fail to validate: ${validate.errors}`)
    }
    return x as WorkflowDefinition
}

export function dateToString(x: any) {
    if (x instanceof Date) {
        return x.toISOString()
    } else if (x instanceof Array) {
        return x.map(dateToString)
    } else if (typeof x === "object") {
        for (const [key, value] of Object.entries(x)) {
            x[key] = dateToString(value)
        }
    }
    return x
}
