<script lang="ts" setup>
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import InputText from '/@/components/shared/InputText.vue'
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

const { request, editedValue } = storeToRefs(requestDetailStore)

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
</script>

<template>
  <div v-if="!props.isEditMode && request" class="flex flex-grow">
    <h1 class="flex-grow text-3xl">
      {{ request.title }}
    </h1>
    <button v-if="hasAuthority" @click="emit('changeEditMode', 'edit')">
      <EllipsisHorizontalIcon class="w-10" />
    </button>
  </div>
  <div v-else class="flex flex-grow">
    <InputText
      v-model="editedValue.title"
      class="flex-grow"
      placeholder="タイトル"
      type="text" />
  </div>
</template>
