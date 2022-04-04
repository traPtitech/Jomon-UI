<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import 'vue-select/dist/vue-select.css'

import { useAdminStore } from '../stores/admin'
import { useUserStore } from '../stores/user'
import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

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
  deleteList.value.forEach(id => {
    adminStore.deleteAdmin(id)
  })
}
function addAdmins() {
  addList.value.forEach(id => {
    adminStore.postAdmin({ id: id })
  })
}
</script>

<template>
  <div class="ml-4" v-if="me.admin">
    <h1 class="text-3xl text-center my-4">管理ページ</h1>
    <div>
      <ul class="flex gap-2">
        <li v-for="admin in admins" :key="admin">
          <div class="border border-black px-2 rounded text-center">
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
      <Button @click.stop="addAdmins" fontSize="lg" padding="sm">
        追加する管理者を選択</Button
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
      <Button @Click.stop="deleteAdmins" fontSize="lg" padding="sm">
        削除する管理者を選択</Button
      >
    </div>
  </div>
  <div v-else>権限がありません。</div>
</template>
