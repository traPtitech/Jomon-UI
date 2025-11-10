<script lang="ts" setup>
import { useNewPartition } from './composables/useNewPartition'
import BaseNumberInput from '@/components/shared/BaseNumberInput.vue'
import BaseTextInput from '@/components/shared/BaseTextInput.vue'
import InputCheckBox from '@/components/shared/InputCheckBox.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'
import { ref, watch } from 'vue'

const { isUserFetched, fetchUsers } = useUserStore()

const { isSending, partition, handleCreatePartition } = useNewPartition()

if (!isUserFetched.value) {
  await fetchUsers()
}

const isUnspecifiedBudget = ref(false)
const savedBudgetBeforeUnspecified = ref<number | null>(null)

watch(isUnspecifiedBudget, newVal => {
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
    <BaseTextInput v-model="partition.name" label="パーティション名" required />
    <div>
      <BaseNumberInput
        v-model="partition.budget"
        label="予算"
        required
        :readonly="isUnspecifiedBudget">
        <span class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
          ¥
        </span>
      </BaseNumberInput>
      <InputCheckBox
        v-model="isUnspecifiedBudget"
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
