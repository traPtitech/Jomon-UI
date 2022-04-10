import type { SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'

const generateBaseAPI = async (sourceFile: SourceFile) => {
  const classes = sourceFile.getClasses()
  const apiClasses = classes.filter(c => {
    const baseClass = c.getBaseClass()
    if (!baseClass) return false
    return baseClass.getName() === 'BaseAPI'
  })

  // 重複を取り除く
  const apiMethods = new Map()
  for (const c of apiClasses) {
    const methods = c.getMethods()
    for (const m of methods) {
      apiMethods.set(m.getName(), m)
    }
  }

  sourceFile.addClass({
    name: 'Apis',
    extends: 'BaseAPI',
    methods: [...apiMethods.values()].map(m => m.getStructure()),
    isExported: true
  })

  await sourceFile.save()
}

export const addApis = async (dir: string) => {
  const project = new Project()
  project.addSourceFilesAtPaths(`${dir}/**/*.ts`)

  const sourceFile = project.getSourceFileOrThrow('api.ts')

  await generateBaseAPI(sourceFile)
}
