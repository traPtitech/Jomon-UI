<script lang="ts" setup>
import { useNewPartition } from './composables/useNewPartition'
import BaseInput from '@/components/shared/BaseInput.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'
import { ref,watch,isRef } from 'vue'

const { isUserFetched, fetchUsers } = useUserStore()

const { isSending, partition, handleCreatePartition } = useNewPartition()

if (!isUserFetched.value) {
  await fetchUsers()
}
const noLimitPartition = ref(false)

watch(noLimitPartition, (val) => {
  if (isRef(partition) && val) {
    partition.value.budget = 1000000000
  }
  else if (isRef(partition) && !val) {
    partition.value.budget = 0
  }
})
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">パーティションの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <BaseInput v-model="partition.name" label="パーティション名" required />
    <div>
    <BaseInput v-if="!noLimitPartition" v-model="partition.budget" type="number" label="予算" required :readonly="noLimitPartition"  :class="{ 'bg-gray-100 cursor-not-allowed': noLimitPartition }">
      <span class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
        ¥
      </span>
    </BaseInput>
    <BaseInput v-model="noLimitPartition" type="checkbox" label="予算上限なし" />
   </div>
    <div>
      <SimpleButton
        class="mt-8 ml-auto block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreatePartition">
        パーティションを作成
      </SimpleButton>
    </div>
  </form>
</template>
