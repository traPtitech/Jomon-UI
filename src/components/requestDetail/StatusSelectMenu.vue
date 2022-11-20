<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import type { RequestStatus, RequestStatusInterface } from '/@/consts/consts'

interface Props {
  shouldMenuOpen?: boolean
}
const props = withDefaults(defineProps<Props>(), { shouldMenuOpen: false })
const emit = defineEmits<{
  (e: 'closeMenu'): void
}>()

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

const handleOpenModal = (status: RequestStatus) => {
  nextStatus.value = status
  openModal()
  emit('closeMenu')
}
</script>

<template>
  <div @click.stop="">
    <ul
      v-if="props.shouldMenuOpen"
      class="text-primary rounded-md border bg-white p-2">
      <li
        v-for="status in statusOptions"
        :key="status.key"
        class="p-1 hover:bg-zinc-100">
        <button
          class="h-full w-full text-left"
          @click="handleOpenModal(status.value)">
          {{ status.key }}
        </button>
      </li>
      <li v-if="statusOptions.length === 0">
        現在変更可能な状態はありません。
      </li>
    </ul>
    <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
      <StatusChangeModal
        v-if="nextStatus !== undefined"
        :next-status="nextStatus"
        @close-modal="closeModal" />
    </ModalWrapper>
  </div>
</template>
