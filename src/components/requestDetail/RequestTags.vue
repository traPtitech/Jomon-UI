<script lang="ts" setup>
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const tagStore = useTagStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)

const handleComplete = () => {
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex items-center">
    <div v-if="!props.isEditMode && requestDetailStore.request" class="pb-2">
      タグ：
      <span v-if="requestDetailStore.request.tags.length === 0">なし</span>
      <TagsGroup v-else :tags="requestDetailStore.request.tags" />
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'tags')" />
    </div>
    <div v-else class="flex items-center">
      タグ：
      <VueSelect
        v-model="requestDetailStore.editedValue.tags"
        :close-on-select="false"
        :create-option="(tag:any) => ({name:tag,id:tag,created_at:'',updated_at:''})"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグ"
        push-tags
        :reduce="(tag:any) => tag.id"
        taggable />
      <SimpleButton
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
