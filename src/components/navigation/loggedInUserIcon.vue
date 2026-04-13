<script lang="ts" setup>
import { ref } from 'vue'

import SearchSelect from '@/components/shared/SearchSelect.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import { loggedInUser, setLoggedInUser } from '@/features/user/__mocks__/data'
import { useUserStore } from '@/features/user/store'

const { userOptions, me, fetchMe } = useUserStore()

const isDevEnvironment = import.meta.env.MODE === 'development'

const selectedUser = ref(loggedInUser.id)

const searchSelectCloseHandler = async () => {
  setLoggedInUser(selectedUser.value)
  await fetchMe({ force: true })
}
</script>

<template>
  <div v-if="me !== undefined" class="w-10">
    <button v-if="isDevEnvironment" popovertarget="user-select">
      <UserIcon :name="me.name" />
    </button>
    <UserIcon v-else :name="me.name" />
  </div>
  <SearchSelect
    id="user-select"
    popover
    class="overflow-visible [position-area:bottom_span-all]"
    :options="userOptions"
    v-model="selectedUser"
    label="ログインユーザーを変更"
    @close="searchSelectCloseHandler" />
</template>
