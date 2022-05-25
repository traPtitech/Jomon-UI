<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import apis from '../lib/apis'
import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const addList = ref<string[]>([])
const deleteList = ref<string[]>([])

onMounted(() => {
  if (userStore.me.admin) {
    if (!adminStore.isAdminFetched) {
      adminStore.fetchAdmins()
    }
    if (!userStore.isUserFetched) {
      userStore.fetchUsers()
    }
  }
})

const deleteAdmins = async () => {
  if (deleteList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    await apis.deleteAdmins(deleteList.value)
    adminStore.admins = adminStore.admins.filter(
      id => !deleteList.value.includes(id)
    )
  } catch (err: any) {
    alert(err.response.data)
  }
}
const addAdmins = async () => {
  if (addList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    await apis.postAdmins(addList.value)
    adminStore.admins = adminStore.admins.concat(addList.value)
  } catch (err: any) {
    alert(err.response.data)
  }
}
</script>

<template>
  <div
    v-if="userStore.me.admin"
    class="flex flex-col mx-auto min-w-160 w-2/3 pt-8 px-12">
    <h1 class="text-center pb-8 text-3xl">管理ページ</h1>
    <div>
      <ul class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="border border-black rounded text-center px-2">
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4 flex gap-4">
      <VueSelect
        v-model="addList"
        class="w-1/2"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="追加する管理者を選択"
        :reduce="(user:any) => user.name" />
      <Button font-size="lg" padding="sm" @click.stop="addAdmins">
        選択した管理者を追加
      </Button>
    </div>
    <div class="mt-12 flex gap-4">
      <VueSelect
        v-model="deleteList"
        class="w-1/2"
        multiple
        :options="adminStore.admins"
        placeholder="削除する管理者を選択" />
      <Button font-size="lg" padding="sm" @click.stop="deleteAdmins">
        選択した管理者を削除
      </Button>
    </div>
  </div>
  <div v-else>権限がありません。</div>
</template>
