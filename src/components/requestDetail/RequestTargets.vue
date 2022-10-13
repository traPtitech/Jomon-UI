<script lang="ts" setup>
import { ref, computed } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import type { RequestDetail } from '/@/lib/apis'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

interface Props {
  request: RequestDetail
  isEditMode: boolean
  value: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string[]): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const formattedTargets = computed(() =>
  props.request.targets.map(target => target.id).join(', ')
)

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
const targetIds = props.request.targets.map(target => target.id) ?? []
const currentTargets = ref(targetIds)

const handleComplete = () => {
  emit('input', currentTargets.value)
  emit('changeEditMode', '')
}
</script>

<template>
  <div>
    <div v-if="!isEditMode">
      払い戻し対象者：
      {{ formattedTargets }}
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'targets')" />
    </div>
    <div v-else class="flex items-center">
      払い戻し対象者：
      <VueSelect
        v-model="currentTargets"
        :close-on-select="false"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="払い戻し対象者"
        :reduce="(user:any) => user.name" />
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
