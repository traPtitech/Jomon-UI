<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parseQueryParams'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

//import StatusChangeForm from '/@/components/requestDetail/StatusChangeForm.vue'

const emit = defineEmits<{ (e: 'changeEditMode', value: EditMode): void }>()

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const tagStore = useTagStore()

const { request, editedValue } = storeToRefs(requestDetailStore)

await requestDetailStore.fetchRequestDetail(id)
if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
</script>

<template>
  <div v-if="request !== undefined">
    <div class="mt-2 flex justify-between">
      <div class="flex items-center">
        グループ：
        <InputSelect
          v-model="editedValue.group"
          class="w-52"
          :options="groupStore.groupOptions"
          placeholder="グループ" />
      </div>
      <div>
        金額：
        <InputNumber
          v-model="editedValue.amount"
          class="mr-1 w-24"
          :min="1"
          placeholder="金額" />円
      </div>
    </div>
    <div class="mt-2 flex items-center">
      タグ：
      <InputSelectTagWithCreation v-model="editedValue.tags" />
    </div>
    <div class="mt-4 flex items-center">
      払い戻し対象者：
      <InputSelect
        v-model="editedValue.targets"
        is-multiple
        :options="userStore.userOptions"
        placeholder="払い戻し対象者" />
    </div>
    <div class="flex justify-end gap-4">
      <SimpleButton
        font-size="md"
        padding="md"
        @click="emit('changeEditMode', 'cancel')">
        キャンセル
      </SimpleButton>
      <SimpleButton
        font-size="md"
        kind="success"
        padding="md"
        @click="emit('changeEditMode', 'update')">
        更新
      </SimpleButton>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar::after {
  content: '';
  display: block;
  border: 1px solid #e5e7eb;
  margin: 12px auto;
  background-color: #e5e7eb;
}
</style>
