import { addApis } from './add-apis.js'
import { addTsIgnoreToImports } from './add-ts-ignore-to-imports.js'
import { execa } from 'execa'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const SWAGGER_PATH =
  'https://raw.githubusercontent.com/traPtitech/Jomon/v2/docs/swagger.yaml'
const GENERATED_DIR = 'src/lib/apis/generated'

const generateCmd = [
  'openapi-generator-cli',
  'generate',
  '-g',
  'typescript-axios',
  '-i',
  SWAGGER_PATH,
  '-o',
  GENERATED_DIR
]

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

await (async () => {
  await fs.mkdir(path.resolve(__dirname, '../', GENERATED_DIR), {
    recursive: true
  })

  const p = execa('npx', generateCmd)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  p.stdout?.pipe(process.stdout)
  await p

  // generate Apis class
  await addApis(GENERATED_DIR)

  // importsNotUsedAsValuesでエラーが起きるのですべてのimportに@ts-ignoreを付与する
  await addTsIgnoreToImports(GENERATED_DIR)
})()
