<script lang="ts" setup>
import type { FixMode } from './GroupDetail.vue'
import Button from '/@/components/groupDetail/shared/Button.vue'
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
  詳細：
  <div v-if="!(fixMode === 'description')" class="flex items-start">
    <p class="w-200 h-32 overflow-y-scroll border border-gray-300 pl-1">
      {{ props.group.description }}
    </p>
    <FixButton @click="changeFixMode('description')" />
  </div>
  <div v-if="fixMode === 'description'">
    <textarea
      class="w-200 h-32 resize-none p-1"
      placeholder="詳細"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
    <Button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="changeFixMode('')">
      完了
    </Button>
  </div>
</template>
