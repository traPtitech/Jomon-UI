<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/pages/composables/useRequestDetail'

const emit = defineEmits<{
  (e: 'closeMenu'): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { request } = useRequestDetailStore()

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)

const toggleEditMode = () => {
  emit('closeMenu')
  emit('changeEditMode', 'edit')
}
</script>

<template>
  <ul class="rounded-md border bg-white p-2" @click.stop="">
    <li v-if="hasAuthority" class="p-1 hover:bg-zinc-100">
      <button class="h-full w-full text-left" @click="toggleEditMode">
        編集
      </button>
    </li>
    <li v-if="hasAuthority" class="p-1 hover:bg-zinc-100">
      <RouterLink
        v-if="userStore.isAdmin()"
        :to="`/transactions/new?requestID=${request?.id}`">
        この申請から入出金記録を作成する
      </RouterLink>
    </li>
    <li class="p-1 hover:bg-zinc-100">
      <RouterLink :to="`/transactions?requestID=${request?.id}`">
        この申請の入出金記録へ移動
      </RouterLink>
    </li>
  </ul>
</template>
