<script lang="ts" setup>
import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import { useUserStore } from '@/features/user/store'

import { useNewPartitionGroup } from './composables/useNewPartitionGroup'

const { isPartitionGroupFetched, fetchPartitionGroups } =
  usePartitionGroupStore()

const { isUserFetched, fetchUsers } = useUserStore()

const { isSending, partitionGroup, handleCreatePartitionGroup } =
  useNewPartitionGroup()

if (!isUserFetched.value) {
  await fetchUsers()
}

if (!isPartitionGroupFetched.value) {
  await fetchPartitionGroups()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">パーティショングループの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <BaseTextInput
      v-model="partitionGroup.name"
      label="パーティショングループ名"
      required />
    <div>
      <SimpleButton
        class="mt-8 ml-auto block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreatePartitionGroup">
        パーティショングループを作成
      </SimpleButton>
    </div>
  </form>
</template>
