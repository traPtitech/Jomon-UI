import fs from 'fs/promises'
import path from 'path'

export const fixConfigurationTypes = async (generatedDir: string) => {
  const targetFile = path.resolve(generatedDir, 'configuration.ts')
  try {
    const content = await fs.readFile(targetFile, 'utf-8')

    const parts = content.split('export class Configuration {')
    if (parts.length !== 2) {
      console.warn('Could not find Configuration class in configuration.ts')
      return
    }

    const [preClass, classContent] = parts

    const newClassContent = classContent.replace(
      /^(\s+[a-zA-Z0-9_]+\?:)([^;]+)(;)/gm,
      (match: string, prefix: string, type: string, suffix: string) => {
        if (type.includes('| undefined')) {
          return match
        }
        const newType = type.includes('=>') ? `(${type})` : type
        return `${prefix}${newType} | undefined${suffix}`
      }
    )

    const newContent =
      preClass + 'export class Configuration {' + newClassContent

    await fs.writeFile(targetFile, newContent, 'utf-8')
    console.log('Fixed configuration types in configuration.ts')
  } catch (e) {
    console.error('Failed to fix configuration types:', e)
  }
}
