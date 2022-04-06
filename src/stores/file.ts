import { defineStore } from 'pinia'
import { ref } from 'vue'

import apis from '/@/lib/apis'

export const useFileStore = defineStore('file', () => {
  const files = ref<any[]>([])

  const fetchFiles = async (ids: string[]) => {
    for (let i = 0; i < ids.length; i++) {
      files.value.concat((await apis.filesFileIDGet(ids[i])).data)
    }
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
    await apis.filesPost(file, name, request_id)
  }
  const deleteFile = async (id: string) => {
    await apis.filesFileIDDelete(id)
  }
  return { files, fetchFiles, postFile, deleteFile }
})
