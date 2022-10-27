<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import InputSelect from '/@/components/shared/InputSelect.vue'
import { stateToJpn } from '/@/consts/consts'
import type { RequestStatus, RequestStatusInterface } from '/@/consts/consts'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

const nextStatus = ref<RequestStatus>(request.value?.status ?? 'submitted')
const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
const { shouldShowModal, openModal, closeModal } = useModal()

const statusOptions = computed((): RequestStatusInterface[] => {
  const options: RequestStatusInterface[] = []
  if (showToSubmitted) {
    options.push({ key: '承認待ち', value: 'submitted' })
  }
  if (showToRequired) {
    options.push({ key: '要修正', value: 'fix_required' })
  }
  if (showToAccepted) {
    options.push({ key: '承認済み', value: 'accepted' })
  }
  if (showToRejected) {
    options.push({ key: '却下', value: 'rejected' })
  }
  return options
})

const showToSubmitted =
  (hasAuthority && request.value?.status === 'fix_required') ||
  (userStore.isAdmin() &&
    (request.value?.status === 'fix_required' ||
      request.value?.status === 'accepted'))
const showToRequired =
  userStore.isAdmin() && request.value?.status === 'submitted'
const showToAccepted =
  userStore.isAdmin() && request.value?.status === 'submitted'
const showToRejected =
  userStore.isAdmin() && request.value?.status === 'submitted'

function handleOpenModal(status: RequestStatus) {
  nextStatus.value = status
  openModal()
}
</script>

<template>
  <div class="flex gap-4">
    <InputSelect
      :clearable="false"
      :model-value="stateToJpn(request?.status ?? 'error')"
      :options="statusOptions"
      placeholder=""
      @update:model-value="handleOpenModal($event)" />
  </div>
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <StatusChangeModal
      v-if="nextStatus !== undefined"
      :next-status="nextStatus"
      @close-modal="closeModal" />
  </ModalWrapper>
</template>
