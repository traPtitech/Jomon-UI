<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'
import type{RequestDetail} from '/@/lib/apis'

interface Props{
  request: RequestDetail
}

const props = defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
</script>

<template>
  <div class="flex">
    詳細：
    <div
      v-if="!(requestDetailStore.editMode === 'content')"
      class="flex w-4/5 items-start">
      <markdown-it
        class="h-32 w-full overflow-y-scroll border border-gray-300 pl-2"
        :text="props.request.content" />
      <edit-button
        v-if="props.request.created_by === userStore.me!.name"
        @click="requestDetailStore.changeEditMode('content')" />
    </div>
    <div v-if="requestDetailStore.editMode === 'content'" class="w-9/10">
      <textarea
        v-model="requestDetailStore.editedValue.content"
        class="h-30 w-4/5 resize-none p-1"
        placeholder="詳細" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </simple-button>
    </div>
  </div>
</template>
