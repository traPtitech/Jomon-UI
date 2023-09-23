<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestStatusUnion } from '/@/features/requestStatus/model'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { me, isAdmin } = storeToRefs(userStore)

const { request } = storeToRefs(requestDetailStore)

const nextStatus = ref<RequestStatusUnion>()
const hasAuthority = isRequestCreator(me.value)
const { shouldShowModal, openModal, closeModal } = useModal()

const showToSubmitted =
  (hasAuthority && request.value?.status === 'fix_required') ||
  (isAdmin.value &&
    (request.value?.status === 'fix_required' ||
      request.value?.status === 'accepted'))
const showToRequired = isAdmin.value && request.value?.status === 'submitted'
const showToAccepted = isAdmin.value && request.value?.status === 'submitted'
const showToRejected = isAdmin.value && request.value?.status === 'submitted'

function handleOpenModal(status: RequestStatusUnion) {
  nextStatus.value = status
  openModal()
}
</script>

<template>
  <div class="flex gap-4">
    <SimpleButton
      v-if="showToSubmitted"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('submitted')">
      承認待ちにする
    </SimpleButton>
    <SimpleButton
      v-if="showToRequired"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('fix_required')">
      要修正にする
    </SimpleButton>
    <SimpleButton
      v-if="showToAccepted"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('accepted')">
      承認済みにする
    </SimpleButton>
    <SimpleButton
      v-if="showToRejected"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('rejected')">
      却下する
    </SimpleButton>
  </div>
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <StatusChangeModal
      v-if="nextStatus"
      :next-status="nextStatus"
      @close-modal="closeModal" />
  </ModalWrapper>
</template>
