<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const addList = ref([] as string[])
const deleteList = ref([] as string[])

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

const deleteAdmins = () => {
  adminStore.deleteAdmins(deleteList.value)
}
const addAdmins = () => {
  adminStore.postAdmins(addList.value)
}
</script>

<template>
  <div v-if="userStore.me.admin" class="ml-4">
    <h1 class="text-center py-8 text-3xl">管理ページ</h1>
    <div>
      <ul class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="border border-black rounded text-center px-2">
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4">
      <VueSelect
        v-model="addList"
        class="mb-4 w-1/2"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="追加する管理者を選択"
        :reduce="(user:any) => user.name" />
      <Button font-size="lg" padding="sm" @click.stop="addAdmins">
        選択した管理者を追加
      </Button>
    </div>
    <div class="mt-12">
      <VueSelect
        v-model="deleteList"
        class="mb-4 w-1/2"
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
