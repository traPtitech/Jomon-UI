import type { SourceFile } from 'ts-morph'
import { SyntaxKind } from 'ts-morph'
import { Project } from 'ts-morph'

const addTsIgnoreToImportsToFile = async (sourceFile: SourceFile) => {
  const imports = sourceFile.getImportDeclarations()

  const insertPos: number[] = []
  for (const imp of imports) {
    const firstComment = imp.getLeadingCommentRanges()?.at(-1)
    if (firstComment) {
      const kind = firstComment.getKind()
      const text = firstComment.getText()
      if (
        kind === SyntaxKind.SingleLineCommentTrivia &&
        (text.includes('// @ts-ignore') || text.includes('// @ts-expect-error'))
      ) {
        continue
      }
    }
    insertPos.push(imp.getStart(false))
  }

  sourceFile.applyTextChanges(
    insertPos.map(pos => ({
      span: { start: pos, length: 0 },
      newText: '// @ts-ignore error happens by importsNotUsedAsValues\n'
    }))
  )

  await sourceFile.save()
}

export const addTsIgnoreToImports = async (dir: string) => {
  const project = new Project()
  project.addSourceFilesAtPaths(`${dir}/**/*.ts`)

  for (const sourceFile of project.getSourceFiles()) {
    await addTsIgnoreToImportsToFile(sourceFile)
  }
}
