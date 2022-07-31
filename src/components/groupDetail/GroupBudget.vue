<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import type { FixMode } from './GroupDetail.vue'
import FixButton from '/@/components/shared/FixButton.vue'
import type { Group, PostGroup } from '/@/lib/apis'

interface Props {
  group: Group
  putGroup: (id: string, group: PostGroup) => void
  changeFixMode: (kind: FixMode) => void
  fixMode: FixMode
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: string): void }>()
</script>

<template>
  <div v-if="!(fixMode === 'budget')" class="flex items-start">
    予算：{{ props.group.budget }}円
    <fix-button @click="changeFixMode('budget')" />
  </div>
  <div v-if="fixMode === 'budget'">
    予算：<input
      class="w-24 p-1"
      placeholder="金額"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />円
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="changeFixMode('')">
      完了
    </simple-button>
  </div>
</template>
