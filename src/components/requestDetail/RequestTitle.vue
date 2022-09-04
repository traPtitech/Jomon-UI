<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
}

const props = defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
</script>

<template>
  <div v-if="!(requestDetailStore.editMode === 'title')" class="flex">
    <h1 class="text-3xl">
      {{ props.request.title }}
    </h1>
    <edit-button
      v-if="hasAuthority"
      class="text-secondary"
      @click="requestDetailStore.changeEditMode('title')" />
  </div>
  <div v-if="requestDetailStore.editMode === 'title'">
    <input
      v-model="requestDetailStore.editedValue.title"
      class="rounded p-1"
      placeholder="タイトル"
      type="text" />
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="requestDetailStore.changeEditMode('')">
      完了
    </simple-button>
  </div>
</template>
