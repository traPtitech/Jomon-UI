<script lang="ts" setup>
import { ref } from 'vue'

import StatusChip from '/@/components/shared/StatusChip.vue'
import type { ApplicationDetail } from '/@/features/request/model'
import { useStatusOptions } from '/@/features/requestStatus/composables'
import FloatingMenu from '/@/components/shared/FloatingMenu.vue'
import { useModal } from '/@/components/modal/composables/useModal'
import type { ApplicationStatus } from '/@/features/requestStatus/model'
import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'

const props = defineProps<{
  request: ApplicationDetail
}>()

const handleSelectOption = (status: ApplicationStatus) => {
  nextStatus.value = status
  openModal()
}

const nextStatus = ref<ApplicationStatus>()
const { shouldShowModal, openModal, closeModal } = useModal()

const showMenu = ref(false)
const { statusOptions } = useStatusOptions(props.request)
</script>

<template>
  <div class="relative">
    <StatusChip
      :has-menu="statusOptions.length !== 0"
      has-text
      :status="request.status"
      @click.stop="showMenu = true" />
    <FloatingMenu
      v-if="showMenu && statusOptions.length !== 0"
      class="absolute top-12 left-0 w-40"
      :current-value="request.status"
      :options="statusOptions"
      @close-menu="showMenu = false"
      @select-option="handleSelectOption" />
    <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
      <StatusChangeModal
        v-if="nextStatus"
        :next-status="nextStatus"
        :request="request"
        @close-modal="closeModal" />
    </ModalWrapper>
  </div>
</template>
