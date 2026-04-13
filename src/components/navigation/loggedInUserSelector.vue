<script lang="ts" setup>
import { ref } from 'vue'

import SearchSelect from '@/components/shared/SearchSelect.vue'
import { loggedInUser, setLoggedInUser } from '@/features/user/__mocks__/data'
import { useUserStore } from '@/features/user/store'

const { userOptions, fetchMe } = useUserStore()

const selectedUser = ref(loggedInUser.id)

const searchSelectCloseHandler = async () => {
  setLoggedInUser(selectedUser.value)
  await fetchMe({ force: true })
}
</script>

<template>
  <button popovertarget="user-select">
    <slot />
  </button>
  <SearchSelect
    id="user-select"
    popover
    class="overflow-visible [position-area:bottom_span-all]"
    :options="userOptions"
    v-model="selectedUser"
    label="ログインユーザーを変更"
    @close="searchSelectCloseHandler" />
</template>
