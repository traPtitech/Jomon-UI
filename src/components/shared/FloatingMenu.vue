<script setup lang="ts">
import type { RequestStatus } from '/@/features/requestStatus/model'
import { onMounted, onUnmounted, ref } from 'vue'
import { useModal } from '/@/components/modal/composables/useModal'
import ModalWrapper from '/@/components/modal/ModalWrapper.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'

defineProps<{
  options: { key: string; value: RequestStatus }[]
  currentValue: RequestStatus
}>()

const emit = defineEmits<{
  (e: 'closeMenu'): void
}>()

const handleSelectOption = (status: RequestStatus) => {
  // TODO: emitして一般化
  nextStatus.value = status
  openModal()
}

const containerRef = ref<HTMLDivElement | null>(null)

const nextStatus = ref<RequestStatus>()
const { shouldShowModal, openModal, closeModal } = useModal()

const callback = () => {
  emit('closeMenu')
}

onMounted(() => {
  window.addEventListener('click', callback)
})
onUnmounted(() => {
  window.removeEventListener('click', callback)
})
</script>

<template>
  <div
    ref="containerRef"
    class="bg-white rounded-md p-2 flex flex-col gap-2 border"
    @click.stop="">
    <div
      v-for="option in options"
      :key="option.value"
      class="hover:bg-gray-200 rounded p-1">
      <button
        class="w-full h-full text-left"
        @click="handleSelectOption(option.value)">
        {{ option.key }}
      </button>
    </div>
    <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
      <StatusChangeModal
        v-if="nextStatus"
        :next-status="nextStatus"
        @close-modal="closeModal" />
    </ModalWrapper>
  </div>
</template>
