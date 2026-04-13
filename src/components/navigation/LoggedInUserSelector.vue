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

const label = 'ログインユーザーを変更'
</script>

<template>
  <button popovertarget="user-select" :aria-label="label">
    <slot />
  </button>
  <SearchSelect
    id="user-select"
    popover
    class="overflow-visible [position-area:bottom_span-all]"
    :options="userOptions"
    v-model="selectedUser"
    :label="label"
    @close="searchSelectCloseHandler" />
</template>
