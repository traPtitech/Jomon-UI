<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useAdminStore } from '../stores/admin'
import { useUserStore } from '../stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const { admins } = storeToRefs(adminStore)
const { users } = storeToRefs(userStore)

const selected = ref('') //ライブラリ決めて複数選択できるようにしてから色々書く
</script>
<template>
  <div>
    <h1 class="text-3xl text-center mt-4 mb-4">管理ページ</h1>
    <div>
      <ul class="flex">
        <li v-for="admin in admins" key="admin" class="mr-4">
          <div
            class="border border-solid border-black pr-2 pl-2 rounded-md inline-block text-center"
          >
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div>
      管理者から削除
      <select v-model="selected">
        <option v-for="admin in admins" value="admin">
          {{ admin }}
        </option>
      </select>
    </div>
    <div>
      管理者を追加
      <select v-model="selected">
        <option v-for="user in users" value="user.name">
          {{ user.name }}
        </option>
      </select>
    </div>
  </div>
</template>
