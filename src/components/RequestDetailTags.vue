<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'

import { useRequestDetailStore } from '../stores/requestDetail'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import NewTagModal from './modal/NewTagModal.vue'
import Button from './shared/Button.vue'
import EditButton from './shared/EditButton.vue'
import Tags from './shared/Tags.vue'
import VueSelect from './shared/VueSelect.vue'

const requestDetailStore = useRequestDetailStore()
const tagStore = useTagStore()
const userStore = useUserStore()
</script>

<template>
  <div class="pt-4">
    <div v-if="!requestDetailStore.request.tags">タグ：なし</div>
    <div v-else-if="!(requestDetailStore.editMode === 'tags')">
      タグ：
      <Tags :tags="requestDetailStore.request.tags" />
      <EditButton
        v-if="requestDetailStore.request.created_by === userStore.me.name"
        @click="requestDetailStore.changeEditMode('tags')" />
    </div>
    <div
      v-else-if="requestDetailStore.editMode === 'tags'"
      class="flex items-center">
      タグ：
      <VueSelect
        v-model="requestDetailStore.editedValue.tags"
        class="w-200"
        :close-on-select="false"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグ" />
      <Button
        class="ml-2"
        font-size="sm"
        padding="md"
        @click.stop="openModal(NewTagModal)">
        タグを新規作成
      </Button>
      <Button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </Button>
    </div>
  </div>
</template>
