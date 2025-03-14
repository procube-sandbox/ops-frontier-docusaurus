import { JSONSchema } from "json-schema-to-ts"
import { JSONSchemaType } from "json-schema-to-ts/lib/types/definitions"

declare module "*.json" {
    const schema =  data as const

    export default schema
}
