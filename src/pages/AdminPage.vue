<script lang="ts" setup>
import { ref } from 'vue'

import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

import FormSelect from '/@/components/shared/FormSelect.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useAdmin } from './composables/useAdmin'

const adminStore = useAdminStore()
const userStore = useUserStore()

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const hasAuthority = userStore.isAdmin(userStore.me)
const { absentMembers, isSending, addAdmins, removeAdmins } = useAdmin()

if (userStore.me && userStore.me.admin) {
  if (!adminStore.isAdminFetched) {
    await adminStore.fetchAdmins()
  }
  if (!userStore.isUserFetched) {
    await userStore.fetchUsers()
  }
}
</script>

<template>
  <div v-if="!hasAuthority" class="p-2">権限がありません。</div>
  <div v-else class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <h1 class="pb-8 text-center text-3xl">管理ページ</h1>
    <div class="flex items-center">
      管理者：
      <ul class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="border-secondary rounded border px-2 text-center">
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4 flex gap-4">
      <FormSelect
        v-model="addList"
        class="w-1/2"
        is-multiple
        :options="absentMembers"
        placeholder="追加する管理者を選択" />
      <SimpleButton
        class="flex items-center"
        font-size="lg"
        :is-disabled="isSending"
        padding="sm"
        @click.stop="addAdmins(addList)">
        選択した管理者を追加
      </SimpleButton>
    </div>
    <div class="mt-12 flex gap-4">
      <FormSelect
        v-model="removeList"
        class="w-1/2"
        is-multiple
        :options="adminStore.adminOptions"
        placeholder="削除する管理者を選択" />
      <SimpleButton
        class="flex items-center"
        font-size="lg"
        :is-disabled="isSending"
        padding="sm"
        @click.stop="removeAdmins(removeList)">
        選択した管理者を削除
      </SimpleButton>
    </div>
  </div>
</template>
