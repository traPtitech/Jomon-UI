<script lang="ts" setup>
import BaseInput from '/@/components/shared/BaseInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useUserStore } from '/@/stores/user'
import { useNewPartition } from './composables/useNewPartition'

const { isUserFetched } = useUserStore()

const { isSending, partition, handleCreatePartition } = useNewPartition()

if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">パーティションの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <BaseInput v-model="partition.name" label="パーティション名" required />
    <BaseInput v-model="partition.budget" type="number" label="予算" required>
      <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
        ¥
      </span>
    </BaseInput>
    <div>
      <SimpleButton
        class="ml-auto mt-8 block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreatePartition">
        パーティションを作成
      </SimpleButton>
    </div>
  </form>
</template>
