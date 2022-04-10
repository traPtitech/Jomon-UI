/**
 * plugin:@typescript-eslint/eslint-recommended
 *
 * @typescript-eslint/eslint-recommendedはoverridesが['*.ts','*.tsx']になっている
 * そのため、`.vue`内の`<script lang='ts'>`に適用されない
 * 適用されるようにするためにoverridesに'*.vue'を追加する
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const typescriptEslintEslintRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended')

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
