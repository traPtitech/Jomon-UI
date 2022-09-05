<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import type { PostGroup } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import GroupName from '/@/components/groupDetail/GroupName.vue'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'

import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'

export type EditMode = 'name' | 'description' | 'budget' | ''

interface Props {
  group: GroupDetailType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'fixGroup', value: GroupDetailType): void
}>()

const userStore = useUserStore()

const editMode = ref<EditMode>('')
const editedValue = ref({
  name: props.group.name,
  description: props.group.description,
  budget: props.group.budget.toString()
})
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)

async function changeEditMode(kind: EditMode) {
  if (kind !== '') {
    editMode.value = kind
  } else {
    const value = {
      name: editedValue.value.name,
      description: editedValue.value.description,
      budget: Number(editedValue.value.budget)
    }
    await putGroup(props.group.id, value)
    editMode.value = ''
  }
}
const putGroup = async (id: string, willPutGroup: PostGroup) => {
  if (!hasAuthority) {
    alert('権限がありません。')
    return
  }
  try {
    const res = (await apis.putGroupDetail(id, willPutGroup)).data
    const nextGroup: GroupDetailType = {
      ...props.group,
      name: res.name,
      description: res.description,
      budget: res.budget
    }
    emit('fixGroup', nextGroup)
    editedValue.value = {
      name: nextGroup.name,
      description: nextGroup.description,
      budget: nextGroup.budget.toString()
    }
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <GroupName
        :group="group"
        :is-edit-mode="editMode === 'name'"
        :value="editedValue.name"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.name = $event" />
    </div>
    <div class="mt-4">
      <GroupDescription
        :group="group"
        :is-edit-mode="editMode === 'description'"
        :value="editedValue.description"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.description = $event" />
    </div>
    <div class="mt-4 h-10">
      <GroupBudget
        :group="group"
        :is-edit-mode="editMode === 'budget'"
        :value="editedValue.budget"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.budget = $event" />
    </div>
    <div>
      <button>
        <router-link
          class="flex items-center"
          :to="`/transactions?group=${props.group.id}`">
          このグループの入出金記録へ
          <ArrowTopRightOnSquareIcon class="w-6" />
        </router-link>
      </button>
    </div>
  </div>
</template>
