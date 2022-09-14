<script lang="ts" setup>
import { ref, computed } from 'vue'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useUserStore } from '/@/stores/user'

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

const formattedTargets = computed(() =>
  props.request.targets.map(target => target.id).join(', ')
)
const hasAuthority = isCreater(userStore.me, props.request.created_by)
const targetIds = props.request.targets.map(target => target.id) ?? []
const currentTargets = ref(targetIds)

const handleComplete = () => {
  emit('input', currentTargets.value)
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex">
    <div v-if="!isEditMode">
      払い戻し対象者：
      {{ formattedTargets }}
      <edit-button
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'targets')" />
    </div>
    <div v-else>
      払い戻し対象者：
      <vue-select
        v-model="currentTargets"
        class="inline"
        :close-on-select="false"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="払い戻し対象者"
        :reduce="(user:any) => user.name" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </simple-button>
    </div>
  </div>
</template>
