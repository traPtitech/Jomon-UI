<script lang="ts" setup>
import { ref } from 'vue'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TagGroup from '/@/components/shared/TagsGroup.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
  isEditMode: boolean
  value: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string[]): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const tagStore = useTagStore()
const userStore = useUserStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
const tagIds = props.request.tags.map(tag => tag.id) ?? []
const currentTags = ref(tagIds)

const handleComplete = () => {
  emit('input', currentTags.value)
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex">
    タグ：
    <div v-if="!props.request.tags">なし</div>
    <div v-else-if="!isEditMode">
      <tag-group :tags="props.request.tags" />
      <edit-button
        v-if="hasAuthority"
        class="text-secondary"
        @click="emit('changeEditMode', 'tags')" />
    </div>
    <div v-else class="flex items-center">
      <vue-select
        v-model="currentTags"
        :close-on-select="false"
        :create-option="(tag: any) => ({ name: tag, id: tag, created_at: '', updated_at: '' })"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグ"
        push-tabs
        :reduce="(tag:any) => tag.id"
        taggable />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </simple-button>
    </div>
  </div>
</template>
