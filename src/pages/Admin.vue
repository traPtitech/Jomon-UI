<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useAdminStore } from '../stores/admin'
import { useUserStore } from '../stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const { admins } = storeToRefs(adminStore)
const { users } = storeToRefs(userStore)
const addList = ref([] as string[])
const deleteList = ref([] as string[])

onMounted(() => {
  adminStore.getAdmins()
  userStore.getUsers()
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
  <div class="ml-4">
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
      <v-select
        v-model="addList"
        label="name"
        :options="users"
        placeholder="管理者を追加"
        :reduce="(user:any) => user.name"
        multiple
        class="w-1/2 mb-2"
      ></v-select>
      <button
        @click="addAdmins"
        class="border border-solid border-black rounded-md"
      >
        管理者に追加
      </button>
    </div>
    <div class="mt-4">
      <v-select
        v-model="deleteList"
        :options="admins"
        placeholder="管理者から削除"
        multiple
        class="w-1/2 mb-2"
      ></v-select>
      <button
        @click="deleteAdmins"
        class="border border-solid border-black rounded-md"
      >
        管理者から削除
      </button>
    </div>
  </div>
</template>
