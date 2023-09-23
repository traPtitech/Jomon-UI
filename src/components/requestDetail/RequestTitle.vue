<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request, editedValue } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)
</script>

<template>
  <div v-if="!props.isEditMode && request" class="flex flex-grow">
    <h1 class="flex-grow text-3xl">
      {{ request.title }}
    </h1>
    <SimpleButton
      v-if="hasAuthority"
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', 'title')">
      編集
    </SimpleButton>
  </div>
  <div v-else class="flex flex-grow">
    <InputText
      v-model="editedValue.title"
      class="flex-grow"
      placeholder="タイトル" />
    <SimpleButton
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
