<script lang="ts" setup>
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { RequestDetail, Status } from '/@/lib/apis'
import { isCreater, isAdmin } from '/@/lib/authorityCheck'

import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'

interface Props {
  request: RequestDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pushStatus', value: Status): void
}>()

const userStore = useUserStore()

const nextStatus = ref<RequestStatus>()
const hasCreaterAuthority = isCreater(userStore.me, props.request.created_by)
const hasAdminAuthority = isAdmin(userStore.me)
const { shouldShowModal, openModal, closeModal } = useModal()

const hasToSubmittedAuthority =
  (hasCreaterAuthority && props.request.status === 'fix_required') ||
  (hasAdminAuthority &&
    (props.request.status === 'fix_required' ||
      props.request.status === 'accepted'))
const hasToFixRequiredAuthority =
  hasAdminAuthority && props.request.status === 'submitted'
const hasToAcceptedAuthority =
  hasAdminAuthority && props.request.status === 'submitted'
const hasToRejectedAuthority =
  hasAdminAuthority && props.request.status === 'submitted'

function handlePushStatus(event: Status) {
  emit('pushStatus', event)
}
function handleOpenModal(status: RequestStatus) {
  nextStatus.value = status
  openModal()
}
</script>

<template>
  <div class="flex gap-4">
    <SimpleButton
      v-if="hasToSubmittedAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('submitted')">
      承認待ちにする
    </SimpleButton>
    <SimpleButton
      v-if="hasToFixRequiredAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('fix_required')">
      要修正にする
    </SimpleButton>
    <SimpleButton
      v-if="hasToAcceptedAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="handleOpenModal('accepted')">
      承認済みにする
    </SimpleButton>
    <SimpleButton
      v-if="hasToRejectedAuthority"
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
      :request="props.request"
      @close-modal="closeModal"
      @push-status="handlePushStatus($event)" />
  </ModalWrapper>
</template>
