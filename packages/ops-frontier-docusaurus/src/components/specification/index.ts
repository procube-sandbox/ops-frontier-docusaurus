import assert from 'assert';
import YAML from 'yaml';

// import { unified } from 'unified'
// import rehypeParse from 'rehype-parse'
// import remarkStringify from 'remark-stringify'
import {fromHtml} from 'hast-util-from-html'

function processMultipleLines(text) {
  if (text) {
    const lines = text.split(/\n/)
    if (lines.length == 1 || lines[0].startsWith('<')) return text
    return `<details><summary>${lines[0]}</summary><div>${lines.slice(1).join(lines[1].startsWith('<')?'\n':'<br/>')}</div></details>`
  }
  return ""
}

function processTest(test, options) {
  const test_list = test.map((item) => {
    const procedure = item.procedure?`<b>テスト手順:</b><br/>${processMultipleLines(item.procedure)}<br/>`:''
    const expects = item.expects?`<b>期待される結果:</b><br/>${processMultipleLines(item.expects)}<br/>`:''
    const comments = item.comments?`<b>備考:</b><br/>${processMultipleLines(item.comments)}`:''
    return `<tr><td>${item.id || ""}</td><td>${processMultipleLines(item.spec)}</td><td>${statusClass(item.status)}</td><td>${procedure + expects + comments}</td></tr>\n`
  })
  return `<table class="test-spec"><thead><tr><td>ID</td><td>要件</td><td>状態</td><td>テスト手順など</td></tr></thead>\n<tbody>\n${test_list.join('\n')}</tbody></table>`
}

const statusClassMap = {
  '仕様待ち': 'waiting',
  '未実装': 'need-implement',
  '未テスト': 'need-test',
  'テスト不要': 'no-test',
  '実装不要': 'no-implement',
  'OK': 'ok',
  'NG': 'ng'
}
function statusClass(status) {
  const statusClassValue = statusClassMap[status]
  if (! statusClassValue) {
    throw new Error(`test status ${status} is not valid.`)
  }
  return `<div class="${statusClassValue}">${status}</div>`
}

const plugin = (options) => {
  const transformer = async (ast, vfile) => {
      assert(ast.type == 'root')
      assert(Array.isArray(ast.children))
      ast.children = ast.children.map((node) => {
        if (node.type == 'code' && node.lang == 'yaml' && node.meta && node.meta.includes('format_as_test_table')) {
          try {
            return fromHtml(processTest(YAML.parse(node.value), node.meta), {fragment: true}).children[0]
          } catch (e) {
            throw new Error(`error occur in yaml test specification file:${vfile.path} line:${node.position.start.line} error:${e}`)
          }
        }
        return node
      })
    }
    return transformer;
  };

export default plugin;
