import { fakerJA as faker } from '@faker-js/faker'

import type { FileMeta } from '@/lib/apis'

interface MockFileEntry {
  file: File
  meta: FileMeta
}

const createFileFromDataUri = async (
  dataUri: string,
  name: string
): Promise<File> => {
  // fetchに渡されるのはデータURIであるため、通信は発生しません。
  const res = await fetch(dataUri)
  const blob = await res.blob()
  return new File([blob], name, {
    type: blob.type,
  })
}

const createMockFileEntry = async (): Promise<MockFileEntry> => {
  const file = await createFileFromDataUri(
    faker.image.dataUri(),
    faker.system.commonFileName('svg')
  )
  return {
    file: file,
    meta: {
      id: faker.string.uuid(),
      name: file.name,
      mime_type: file.type,
      created_at: faker.date.past().toISOString(),
    },
  }
}

export const mockIdToMockFileEntry = new Map(
  (
    await Promise.all(
      faker.helpers.multiple(createMockFileEntry, {
        count: {
          min: 0,
          max: 10,
        },
      })
    )
  ).map(file => [file.meta.id, file])
)
