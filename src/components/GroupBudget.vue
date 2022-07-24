<script lang="ts" setup>
import type { Group, PostGroup } from '../lib/apis'
import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'

interface Props {
  group: Group
  putGroup: (id: string, group: PostGroup) => void
  changeFixMode: (kind: 'name' | 'description' | 'budget' | '') => void
  fixMode: 'name' | 'description' | 'budget' | ''
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: string): void }>()
</script>

<template>
  <div v-if="!(fixMode === 'budget')" class="flex items-start">
    予算：{{ props.group.budget }}円
    <FixButton @click="changeFixMode('budget')" />
  </div>
  <div v-if="fixMode === 'budget'">
    予算：<input
      class="w-24 p-1"
      placeholder="金額"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />円
    <Button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="changeFixMode('')">
      完了
    </Button>
  </div>
</template>
