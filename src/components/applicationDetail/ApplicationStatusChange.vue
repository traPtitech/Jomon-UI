<script lang="ts" setup>
import ModalWrapper from '@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '@/components/modal/StatusChangeModal.vue'
import { useModal } from '@/components/modal/composables/useModal'
import FloatingMenu from '@/components/shared/FloatingMenu.vue'
import StatusChip from '@/components/shared/StatusChip.vue'
import type { ApplicationDetail } from '@/features/application/entities'
import { useStatusOptions } from '@/features/applicationStatus/composables'
import type { ApplicationStatus } from '@/features/applicationStatus/entities'
import { ref } from 'vue'

const props = defineProps<{
  application: ApplicationDetail
}>()

const handleSelectOption = (status: ApplicationStatus) => {
  nextStatus.value = status
  openModal()
}

const nextStatus = ref<ApplicationStatus>()
const { shouldShowModal, openModal, closeModal } = useModal()

const showMenu = ref(false)
const { statusOptions } = useStatusOptions(props.application)
</script>

<template>
  <div class="relative">
    <StatusChip
      :has-menu="statusOptions.length !== 0"
      has-text
      :status="application.status"
      @click.stop="showMenu = true" />
    <FloatingMenu
      v-if="showMenu && statusOptions.length !== 0"
      class="absolute top-12 left-0 w-40"
      :current-value="application.status"
      :options="statusOptions"
      @close-menu="showMenu = false"
      @select-option="handleSelectOption" />
    <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
      <StatusChangeModal
        v-if="nextStatus"
        :next-status="nextStatus"
        :application="application"
        @close-modal="closeModal" />
    </ModalWrapper>
  </div>
</template>
