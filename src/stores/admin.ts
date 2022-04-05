import { defineStore } from 'pinia'
import { ref } from 'vue'

// SwaggerでSchemaに書けば型名を指定できる
import type { InlineObject2 } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useAdminStore = defineStore('admin', () => {
  // admins: ['mehm8128', 'mehm81', 'mehm']
  const admins = ref<string[]>([])
  const isAdminFetched = ref(false)

  const fetchAdmins = async () => {
    admins.value = (await apis.adminsGet()).data // Swaggerをちゃんと書けば型付きで情報が取れる
  }
  const postAdmin = async (admin: InlineObject2) => {
    await apis.adminsPost(admin)
  }
  const deleteAdmin = async (admin: string) => {
    await apis.adminsUserIDDelete(admin)
  }
  return {
    admins,
    isAdminFetched,
    fetchAdmins,
    postAdmin,
    deleteAdmin
  }
})
