<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import SearchSelect from '@/components/shared/SearchSelect.vue'
import { loggedInUser, setLoggedInUser } from '@/features/user/__mocks__/data'
import { useUserStore } from '@/features/user/store'

const { userOptions, fetchMe, fetchUsers } = useUserStore()

const selectedUser = ref(loggedInUser.id)

onMounted(fetchUsers)

const searchSelectCloseHandler = async () => {
  setLoggedInUser(selectedUser.value)
  await fetchMe({ force: true })
}

const label = 'ログインユーザーを変更'
</script>

<template>
  <!-- @vue-expect-error -->
  <button popovertarget="user-select" :aria-label="label">
    <slot />
  </button>
  <!-- @vue-expect-error -->
  <SearchSelect
    id="user-select"
    popover
    class="overflow-visible [position-area:bottom_span-all]"
    :options="userOptions"
    v-model="selectedUser"
    :label="label"
    @close="searchSelectCloseHandler" />
</template>
