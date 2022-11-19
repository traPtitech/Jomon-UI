<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import InputText from '/@/components/shared/InputText.vue'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()

const requestDetailStore = useRequestDetailStore()

const { request, editedValue } = storeToRefs(requestDetailStore)
</script>

<template>
  <div v-if="!props.isEditMode && request" class="flex flex-grow">
    <h1 class="flex-grow text-3xl">
      {{ request.title }}
    </h1>
  </div>
  <div v-else class="flex flex-grow">
    <InputText
      v-model="editedValue.title"
      class="flex-grow"
      placeholder="タイトル"
      type="text" />
  </div>
</template>
