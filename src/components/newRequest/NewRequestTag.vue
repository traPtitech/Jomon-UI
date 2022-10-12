<script lang="ts" setup>
import { ref } from 'vue'

import { useTagStore } from '/@/stores/tag'

import VueSelect from '/@/components/shared/VueSelect.vue'
import type { RequestRequest } from '/@/pages/NewRequestPage.vue'

interface Props {
  request: RequestRequest
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: string[]): void }>()

const tagStore = useTagStore()

const tags = ref(props.request.tags)
</script>

<template>
  <div class="flex flex-col">
    <label>タグ</label>
    <div class="flex">
      <VueSelect
        v-model="tags"
        class="w-2/3"
        :close-on-select="false"
        :create-option="(tag: any) => ({ name: tag, id: tag, created_at: '', updated_at: '' })"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグを選択"
        push-tags
        :reduce="(tag:any) => tag.id"
        taggable
        @close="emit('input', tags)" />
    </div>
  </div>
</template>
