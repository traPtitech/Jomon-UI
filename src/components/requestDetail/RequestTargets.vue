<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreater } = requestDetailStore
const { request, editedValue } = storeToRefs(requestDetailStore)
const { me, userOptions } = storeToRefs(userStore)

const formattedTargets = computed(
  () => request.value?.targets.map(target => target.target).join(', ') ?? ''
)

const hasAuthority = isRequestCreater(me.value)

const handleComplete = () => {
  emit('changeEditMode', '')
}
</script>

<template>
  <div>
    <div v-if="!props.isEditMode">
      払い戻し対象者：
      {{ formattedTargets }}
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'targets')" />
    </div>
    <div v-else class="flex items-center">
      払い戻し対象者：
      <InputSelectMultiple
        v-model="editedValue.targets"
        :options="userOptions"
        placeholder="払い戻し対象者"
        uniq-key="target" />
      <SimpleButton
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
