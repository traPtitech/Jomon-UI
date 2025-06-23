<script setup lang="ts">
import { usePartitonDetailStore } from '/@/stores/partitonDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/partitonDetail/composables/usePartitonInformation'
import EditButton from '/@/components/shared/EditButton.vue'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const { me } = useUserStore()
const { canEditPartiton, partiton, editedValue } = usePartitonDetailStore()
</script>

<template>
  <div v-if="partiton" class="flex items-center gap-3">
    <h1 v-if="!props.isEditMode" class="grow text-2xl">
      {{ partiton.name }}
    </h1>
    <BaseInput
      v-else
      v-model="editedValue.name"
      label="パーティション名"
      class="grow" />
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
    <EditButton
      v-if="canEditPartiton(me)"
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'name')
      " />
  </div>
</template>
