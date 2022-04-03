<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import 'vue-select/dist/vue-select.css'

import Button from '../components/shared/Button.vue'
import VueSelect from '../components/shared/VueSelect.vue'
import { useAdminStore } from '../stores/admin'
import { useUserStore } from '../stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const { admins } = storeToRefs(adminStore)
const { users, me } = storeToRefs(userStore)
const addList = ref([] as string[])
const deleteList = ref([] as string[])

onMounted(() => {
  if (me.value.admin) {
    adminStore.getAdmins()
    userStore.getUsers()
  }
})
function deleteAdmins() {
  for (let i = 0; i < deleteList.value.length; i++) {
    adminStore.deleteAdmin(deleteList.value[i])
  }
}
function addAdmins() {
  for (let i = 0; i < addList.value.length; i++) {
    adminStore.postAdmin({ id: addList.value[i] })
  }
}
</script>
<template>
  <div class="ml-4" v-if="me.admin">
    <h1 class="text-3xl text-center mt-4 mb-4">管理ページ</h1>
    <div>
      <ul class="flex">
        <li v-for="admin in admins" :key="admin" class="mr-4">
          <div
            class="border border-solid border-black pr-2 pl-2 rounded-md inline-block text-center"
          >
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4">
      <VueSelect
        v-model="addList"
        label="name"
        :options="users"
        placeholder="管理者を追加"
        :reduce="(user:any) => user.name"
        multiple
        class="w-1/2 mb-2"
      ></VueSelect>
      <Button @onClick="addAdmins" fontSize="lg" padding="sm">
        管理者を追加</Button
      >
    </div>
    <div class="mt-4">
      <VueSelect
        v-model="deleteList"
        :options="admins"
        placeholder="管理者から削除"
        multiple
        class="w-1/2 mb-2"
      ></VueSelect>
      <Button @onClick="deleteAdmins" fontSize="lg" padding="sm">
        管理者を削除</Button
      >
    </div>
  </div>
  <div v-else>権限がありません。</div>
</template>
