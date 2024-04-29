<script lang="ts" setup>
import { ref } from 'vue'

import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestDetail } from '/@/features/request/model'
import { useStatusOptions } from '/@/features/requestStatus/composables'
import FloatingMenu from '/@/components/shared/FloatingMenu.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import type { RequestStatus } from '/@/features/requestStatus/model'
import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'

const props = defineProps<{
  request: RequestDetail
}>()

const handleSelectOption = (status: RequestStatus) => {
  nextStatus.value = status
  openModal()
}

const nextStatus = ref<RequestStatus>()
const { shouldShowModal, openModal, closeModal } = useModal()

const showMenu = ref(false)
const { statusOptions } = useStatusOptions(props.request)
</script>

<template>
  <div class="relative">
    <StatusChip
      has-menu
      has-text
      :status="request.status"
      @click.stop="showMenu = true" />
    <FloatingMenu
      v-if="showMenu"
      class="absolute top-12 left-0 w-40"
      :current-value="request.status"
      :options="statusOptions"
      @close-menu="showMenu = false"
      @select-option="handleSelectOption" />
    <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
      <StatusChangeModal
        v-if="nextStatus"
        :next-status="nextStatus"
        @close-modal="closeModal" />
    </ModalWrapper>
  </div>
</template>
