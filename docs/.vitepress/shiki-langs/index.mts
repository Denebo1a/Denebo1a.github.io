import { readFileSync } from 'node:fs'

function loadGrammar(filePath: string) {
  return JSON.parse(
    readFileSync(new URL(filePath, import.meta.url), 'utf-8')
  )
}

const zeekGrammar = loadGrammar('./zeek.tmLanguage.json')

export const customLanguages = [
  async () => ({
    ...zeekGrammar,
    name: 'zeek',
    scopeName: 'source.zeek'
  })
]
