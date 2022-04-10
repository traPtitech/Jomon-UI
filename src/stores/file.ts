import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

export const useFileStore = defineStore('file', () => {
  const files = ref<string[]>([''])

  const fetchFiles = async (ids: string[]) => {
    ids.forEach(async id => {
      files.value.concat((await apis.getFile(id)).data)
    })
  }
  const postFile = async (request_id: string, name: string, file: string) => {
    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('name', name)
    // formData.append('request_id', request_id)
    // const header = {
    //   headers: {
    //     'Content-Type': 'mutipart/form-data'
    //   }
    // }
    await apis.postFile(file, name, request_id)
  }
  const deleteFile = async (id: string) => {
    await apis.deleteFile(id)
  }
  return { files, fetchFiles, postFile, deleteFile }
})
