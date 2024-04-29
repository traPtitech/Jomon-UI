<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { ref } from 'vue'
import RequestTarget from '/@/components/requestDetail/RequestTarget.vue'
import type { RequestTargetDetail } from '/@/features/requestTarget/model'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)

const isEditMode = ref(false)
const editedTargets = ref<RequestTargetDetail[]>(request.value?.targets ?? [])
const toggleEditTargets = () => {
  isEditMode.value = !isEditMode.value
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="text-sm font-bold">払い戻し対象者</div>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditTargets" />
    </div>
    <div v-if="request" class="flex flex-col gap-2">
      <RequestTarget
        v-for="(target, i) in request?.targets"
        :key="target.id"
        v-model:targetModel="editedTargets[i]"
        :is-edit-mode="isEditMode"
        :request="request"
        :target="target" />
    </div>
  </div>
</template>
