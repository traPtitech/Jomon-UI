<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTagStore } from '/@/stores/tag'
import type { Tag } from '/@/features/tag/model'
import SearchSelect from './SearchSelect.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const model = defineModel<Tag[]>({ required: true })

const tagStore = useTagStore()
const { tagOptions } = storeToRefs(tagStore)

const stringModel = computed({
  get: () => model.value.map(tag => tag.name),
  set: (value: string[]) => {
    model.value = value.map(name => ({
      name,
      id: '',
      created_at: '',
      updated_at: ''
    }))
  }
})

const searchOptions = computed(() =>
  tagOptions.value.map(tag => ({
    key: tag.key,
    value: tag.value.name
  }))
)

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <SearchSelect
    v-model="stringModel"
    :options="searchOptions"
    label="タグ"
    multiple
    allow-custom
    @close="handleClose" />
</template>
