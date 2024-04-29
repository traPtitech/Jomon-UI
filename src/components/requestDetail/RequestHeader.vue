<script lang="ts" setup>
import { computed, ref } from 'vue'

import StatusChip from '/@/components/shared/StatusChip.vue'
import type { RequestDetail } from '/@/features/request/model'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import InputText from '/@/components/shared/InputText.vue'
import { editRequestUsecase } from '/@/features/request/usecase'
import { useStatusOptions } from '/@/features/requestStatus/composables'
import FloatingMenu from '/@/components/shared/FloatingMenu.vue'

const props = defineProps<{
  request: RequestDetail
}>()

const totalAmount = computed(() =>
  props.request.targets.reduce((a, target) => a + target.amount, 0)
)

const isEditMode = ref(false)
const editedTitle = ref(props.request.title)
const toggleEditTitle = () => {
  isEditMode.value = !isEditMode.value
}
const handleUpdateTitle = async () => {
  await editRequestUsecase(props.request.id, {
    ...props.request,
    group: props.request.group?.id ?? null,
    title: editedTitle.value
  })
  isEditMode.value = false
}

const showMenu = ref(false)
const { statusOptions } = useStatusOptions(props.request)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <h1 v-if="!isEditMode" class="flex-1 text-2xl">{{ request.title }}</h1>
      <InputText v-else v-model="editedTitle" class="flex-1" />
      <SimpleButton v-if="!isEditMode" padding="sm" @click="toggleEditTitle">
        編集
      </SimpleButton>
      <SimpleButton v-else padding="sm" @click="handleUpdateTitle">
        完了
      </SimpleButton>
    </div>
    <div class="flex items-center justify-between">
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
          @close-menu="showMenu = false" />
      </div>
      <div class="text-3xl font-bold">{{ totalAmount }}円</div>
    </div>
  </div>
</template>
