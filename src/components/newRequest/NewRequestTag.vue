<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'
import { ref } from 'vue'

import NewTagModal from '/@/components/modal/NewTagModal.vue'
import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useTagStore } from '/@/stores/tag'

interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string | null
}
interface Props {
  request: RequestRequest
}

const props = defineProps<Props>()
const tags = ref(props.request.tags)
const tagStore = useTagStore()
const emit = defineEmits<{ (e: 'input', value: string[]): void }>()
</script>

<template>
  <div class="flex flex-col">
    <label>タグ</label>
    <div class="flex">
      <VueSelect
        v-model="tags"
        class="w-2/3"
        :close-on-select="false"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグを選択"
        :reduce="(tag:any) => tag.id"
        @close="emit('input', tags)" />
      <Button
        class="ml-8"
        font-size="lg"
        padding="sm"
        @click.stop="openModal(NewTagModal)">
        タグを新規作成
      </Button>
    </div>
  </div>
</template>
