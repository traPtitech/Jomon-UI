/**
 * plugin:@typescript-eslint/eslint-recommended
 *
 * @typescript-eslint/eslint-recommendedはoverridesが['*.ts','*.tsx']になっている
 * そのため、`.vue`内の`<script lang='ts'>`に適用されない
 * 適用されるようにするためにoverridesに'*.vue'を追加する
 *
 * 参考: https://zenn.dev/the_red/articles/5162f9dbbafca3
 */

// eslint-disable-next-line no-undef
const typescriptEslintEslintRecommended = require('./node_modules/@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended')

// eslint-disable-next-line no-undef
module.exports = {
  ...typescriptEslintEslintRecommended,
  overrides: typescriptEslintEslintRecommended.overrides.map(override => {
    if (override.files.includes('*.ts')) {
      return { ...override, files: [...override.files, '*.vue'] }
    }
    return override
  })
}
