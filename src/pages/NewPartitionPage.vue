<script lang="ts" setup>
import { useNewPartition } from './composables/useNewPartition'
import BaseInput from '@/components/shared/BaseInput.vue'
import InputCheckBox from '@/components/shared/InputCheckButton.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'
import { ref, watch } from 'vue'

const { isUserFetched, fetchUsers } = useUserStore()

const { isSending, partition, handleCreatePartition } = useNewPartition()

if (!isUserFetched.value) {
  await fetchUsers()
}

const isunspecifiedBudget = ref(false)
const savedBudgetBeforeUnspecified = ref<number | null>(null)

watch(isunspecifiedBudget, newVal => {
  if (newVal) {
    savedBudgetBeforeUnspecified.value = partition.value.budget
    partition.value.budget = null
  } else {
    partition.value.budget = savedBudgetBeforeUnspecified.value
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
      <BaseInput
        v-model="partition.budget"
        type="number"
        label="予算"
        required
        :readonly="isunspecifiedBudget">
        <span class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
          ¥
        </span>
      </BaseInput>
      <InputCheckBox
        v-model="isunspecifiedBudget"
        class="mt-1"
        label="予算指定なし" />
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
