<script lang="ts" setup>
import BaseInput from '@/components/shared/BaseInput.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'
import type { ApplicationTargetInput } from '@/lib/apis'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const model = defineModel<ApplicationTargetInput[]>({ required: true })

const { userOptions } = useUserStore()

const selectedUser = computed(() => model.value.map(target => target.target))
const filteredUserOptions = computed(() => {
  return userOptions.value.filter(
    user => !selectedUser.value.includes(user.value)
  )
})

function handleAddTarget() {
  model.value = [...model.value, { target: '', amount: 0 }]
}
function handleRemoveTarget(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul class="flex flex-col gap-2">
      <li v-for="(target, i) in model" :key="target.target" class="flex gap-3">
        <SearchSelect
          v-model="target.target"
          :options="userOptions"
          :display-options="filteredUserOptions"
          class="grow"
          label="払い戻し対象者" />
        <BaseInput v-model="target.amount" type="number" label="金額">
          <span
            class="mt-auto mb-2 ml-3 text-2xl font-bold text-text-secondary">
            ¥
          </span>
        </BaseInput>
        <button
          v-if="model.length > 1"
          aria-label="払い戻し対象者を削除"
          class="flex"
          type="button"
          @click="handleRemoveTarget(i)">
          <TrashIcon class="w-6 text-error-primary" />
        </button>
      </li>
    </ul>
    <div v-if="userOptions.length > model.length" class="ml-3">
      <SimpleButton font-size="base" padding="sm" @click="handleAddTarget">
        <PlusIcon class="mr-2 w-5" />
        払い戻し対象者を追加
      </SimpleButton>
    </div>
  </div>
</template>
