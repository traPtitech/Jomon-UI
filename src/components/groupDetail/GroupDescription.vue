<script lang="ts" setup>
import type { FixMode } from './GroupDetail.vue'
import Button from '/@/components/shared/Button.vue'
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
  <p>詳細</p>
  <div
    v-if="!(fixMode === 'description')"
    class="flex w-full items-start md:w-2/3">
    <p class="h-32 w-full overflow-y-scroll border border-gray-300 pl-1">
      {{ props.group.description }}
    </p>
    <FixButton @click="changeFixMode('description')" />
  </div>
  <div v-if="fixMode === 'description'" class="w-full md:w-2/3">
    <textarea
      class="h-32 w-4/5 resize-none p-1"
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
