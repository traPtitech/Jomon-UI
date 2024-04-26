<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'
import type { RequestTarget } from '/@/features/requestTarget/model'

import UserIcon from '/@/components/shared/UserIcon.vue'
import { RouterLink } from 'vue-router'

defineProps<{
  target: RequestTarget
}>()

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)
</script>

<template>
  <div class="flex items-center gap-3 justify-between">
    <div class="flex items-center gap-1">
      <UserIcon class="w-12" :name="userMap[target.target]" />
      <span>{{ userMap[target.target] }}</span>
    </div>
    <div class="flex gap-3">
      <span>{{ target.amount }}円</span>
      <!--TODO: link-->
      <RouterLink class="text-blue-500 underline" to="/">
        入出金記録を作成
      </RouterLink>
    </div>
  </div>
</template>
