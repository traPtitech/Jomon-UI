<script lang="ts" setup>
import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
  isEditMode: boolean
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
</script>

<template>
  <div v-if="!props.isEditMode" class="flex">
    <h1 class="text-3xl">
      {{ props.request.title }}
    </h1>
    <edit-button
      v-if="hasAuthority"
      class="ml-1"
      @click="emit('changeEditMode', 'title')" />
  </div>
  <div v-else>
    <input
      class="rounded p-1"
      placeholder="タイトル"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </simple-button>
  </div>
</template>
