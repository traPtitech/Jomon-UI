import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

interface File {
  file: string
  name: string
}

export const useFileStore = defineStore('file', () => {
  const files = ref<File[]>([])

  const fetchFiles = async (ids: string[]) => {
    ids.forEach(async id => {
      files.value.concat((await apis.getFile(id)).data)
    })
  }
  const postFile = async (requestId: string, name: string, file: string) => {
    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('name', name)
    // formData.append('requestId', requestId)
    // const header = {
    //   headers: {
    //     'Content-Type': 'mutipart/form-data'
    //   }
    // }
    await apis.postFile(file, name, requestId)
  }
  const deleteFile = async (id: string) => {
    await apis.deleteFile(id)
  }
  return { files, fetchFiles, postFile, deleteFile }
})
