import React, { type JSX } from "react"

export type Props = {
  schema: string
}

const logger = {
    info: (message: string) => {
        console.log(message)
    },
}

export default function JSONSchemaToTable(props: Props): JSX.Element {
  const { schema } = props
  logger.info(`JSONSchemaToTable: schema=${schema}`)
  return (
    <div>
      <h1>JSON Schema Viewer</h1>
    </div>
  )
}
