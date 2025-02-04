import assert from "assert";
import { visit } from "unist-util-visit";
import { logger } from "@docusaurus/logger";
function formatNodePosition(node) {
    return node?.position?.start
        ? logger.interpolate `number=${node.position.start.line}:number=${node.position.start.column}`
        : undefined;
}
const sectionsToTable = (options) => {
    return async (ast, file) => {
        assert(ast.type == "root");
        const filePath = file.path;
        function emitWarning(message, node) {
            const position = formatNodePosition(node);
            logger.warn(`${message} in ${filePath}${position ? `(${position})` : ""}`);
        }
        function processThirdColumn(acc) {
            assert(acc.status === "secondColumn");
            if (acc.thirdColumn) {
                acc.currentRow.children.push(acc.thirdColumn);
                acc.thirdColumn = undefined;
            }
            acc.status = "restColumns";
        }
        function processNewColumn(acc) {
            if (acc.currentRow) {
                acc.currentRow.children.push({
                    type: "mdxJsxFlowElement",
                    name: "td",
                    children: acc.currentColumn,
                });
            }
            if (acc.status === "secondColumn") {
                processThirdColumn(acc);
            }
            acc.currentColumn = [];
        }
        function closePriorRow(acc, heading) {
            if (!acc.currentRow)
                return;
            if (acc.status === "secondColumn") {
                emitWarning("No second column content, push empty column", heading);
                acc.currentRow.children.push({
                    type: "mdxJsxFlowElement",
                    name: "td",
                    children: [],
                });
                processThirdColumn(acc);
            }
            processNewColumn(acc);
            if (acc.currentRow) {
                acc.rows.push(acc.currentRow);
            }
            acc.currentRow = undefined;
        }
        function processNewRow(acc, heading) {
            closePriorRow(acc, heading);
            acc.thirdColumn =
                options.thirdColumnFromHeading &&
                    heading.children.length >= 2 &&
                    heading.children[heading.children.length - 1].type === "textDirective"
                    ? {
                        type: "mdxJsxFlowElement",
                        name: "td",
                        children: [
                            {
                                type: "mdxJsxTextElement",
                                name: "div",
                                attributes: options.thirdColumnClassName ? [
                                    {
                                        type: "mdxJsxAttribute",
                                        name: "class",
                                        value: options.thirdColumnClassName[heading.children[heading.children.length - 1].name],
                                    },
                                ] : [],
                                children: [
                                    {
                                        type: "text",
                                        value: heading.children[heading.children.length - 1].name,
                                    },
                                ],
                            },
                        ],
                    }
                    : null;
            acc.status = "restColumns";
            if (acc.thirdColumn !== null) {
                heading.children.pop();
                acc.status = "secondColumn";
            }
            acc.currentRow = {
                type: "mdxJsxFlowElement",
                name: "tr",
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "td",
                        children: heading.children,
                    },
                ],
            };
            acc.columnOverflow = false;
            acc.currentColumn = [];
        }
        visit(ast, { type: "containerDirective", name: "spec" }, (node, index, parent) => {
            const tableRows = node.children.reduce((acc, child) => {
                if (acc.columnOverflow) {
                    return acc;
                }
                if (acc.status === "start") {
                    if (child.type != "heading") {
                        emitWarning(`Igonore node: spec containerDirective should start with a heading, but found: ${JSON.stringify(child)}`, child);
                        return acc;
                    }
                    const heading = child;
                    acc.headingDepth = heading.depth;
                    acc.status = "secondColumn";
                    processNewRow(acc, heading);
                    return acc;
                }
                if (child.type == "heading") {
                    assert(acc.headingDepth !== undefined);
                    const heading = child;
                    if (heading.depth == acc.headingDepth) {
                        processNewRow(acc, heading);
                        return acc;
                    }
                    else if (heading.depth == acc.headingDepth + 1) {
                        if (acc.currentRow.children.length == options.columnNames.length) {
                            emitWarning("Too many columns, ignore rest nodes", heading);
                            acc.columnOverflow = true;
                        }
                        if (heading.children.length > 1) {
                            emitWarning("Too many text node in heding, ignore", child);
                            return acc;
                        }
                        if (heading.children[0].type != "text") {
                            emitWarning("Heading should be text node, ignore", child);
                            return acc;
                        }
                        processNewColumn(acc);
                        const columnName = heading.children[0].value;
                        const columnNameInHeader = options.columnNames[acc.currentRow.children.length];
                        if (columnName != columnNameInHeader) {
                            emitWarning("Heading name does not match ", child);
                        }
                        return acc;
                    }
                    else if (heading.depth < acc.headingDepth) {
                        emitWarning(`Ignore node: spec container directive should have a heading with the same depth as the first heading, but found: ${JSON.stringify(heading)}`, heading);
                        return acc;
                    }
                }
                // push child to current row
                acc.currentColumn.push(child);
                return acc;
            }, {
                status: "start",
                rows: [],
                columnOverflow: false,
            });
            closePriorRow(tableRows, node);
            const tableNode = {
                type: "mdxJsxFlowElement",
                name: "table",
                position: undefined,
                attributes: options.tableClassName
                    ? [
                        {
                            type: "mdxJsxAttribute",
                            name: "className",
                            value: options.tableClassName,
                        },
                    ]
                    : [],
                children: [
                    {
                        type: "mdxJsxFlowElement",
                        name: "thead",
                        children: [
                            {
                                type: "mdxJsxFlowElement",
                                name: "tr",
                                children: options.columnNames.map((header) => ({
                                    type: "mdxJsxFlowElement",
                                    name: "td",
                                    children: [
                                        {
                                            type: "text",
                                            value: header,
                                        },
                                    ],
                                })),
                            },
                        ],
                    },
                    {
                        type: "mdxJsxFlowElement",
                        name: "tbody",
                        children: tableRows.rows,
                    },
                ],
            };
            // ノードを tableNode に置き換える
            tableNode.position = node.position;
            if (parent && typeof index === "number" && parent.children) {
                ;
                parent.children[index] = tableNode;
            }
            else {
                emitWarning(`failed to replace tableNode parent:${JSON.stringify(parent)}, index:${index}`, node);
            }
        });
    };
};
export default sectionsToTable;
