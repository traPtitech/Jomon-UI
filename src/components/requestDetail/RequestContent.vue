<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import InputTextarea from '/@/components/shared/InputTextarea.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useRequestDetail } from '/@/pages/composables/useRequestDetail'

const toast = useToast()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const { request, editedValue } = storeToRefs(requestDetailStore)
const { putRequest } = useRequestDetail()

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
const isEditMode = ref(false)

async function changeEditMode() {
  if (!isEditMode.value) {
    isEditMode.value = true
    return
  }
  if (request.value !== undefined) {
    await putRequest(request.value.id, requestDetailStore.editedValue)
  } else {
    toast.error('申請の修正に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex">
    <div
      v-if="request !== undefined && !isEditMode"
      class="relative flex flex-grow">
      <MarkdownIt
        class="flex-grow border border-gray-300 p-1"
        :text="request.content" />
      <SimpleButton
        v-if="hasAuthority"
        class="absolute -right-16"
        font-size="sm"
        padding="sm"
        @click="changeEditMode">
        編集
      </SimpleButton>
    </div>
    <div v-else class="relative flex flex-grow">
      <InputTextarea
        v-model="editedValue.content"
        class="flex-grow resize-none"
        placeholder="詳細" />
      <SimpleButton
        class="absolute -right-16"
        font-size="sm"
        padding="sm"
        @click="changeEditMode">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
