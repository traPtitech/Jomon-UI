<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'

import SimpleButton from '../shared/SimpleButton.vue'
import NewTagModal from '/@/components/modal/NewTagModal.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import Tags from '/@/components/shared/Tags.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const requestDetailStore = useRequestDetailStore()
const tagStore = useTagStore()
const userStore = useUserStore()
</script>

<template>
  <div class="flex">
    タグ：
    <div v-if="!requestDetailStore.request.tags">なし</div>
    <div v-else-if="!(requestDetailStore.editMode === 'tags')">
      <tags :tags="requestDetailStore.request.tags" />
      <edit-button
        v-if="requestDetailStore.request.created_by === userStore.me.name"
        @click="requestDetailStore.changeEditMode('tags')" />
    </div>
    <div
      v-else-if="requestDetailStore.editMode === 'tags'"
      class="flex items-center">
      <!--こことか他にもストアのrefをv-modelに設定してるところのVueSelectの要素を削除できない-->
      <vue-select
        v-model="requestDetailStore.editedValue.tags"
        :close-on-select="false"
        label="name"
        multiple
        :options="tagStore.tags"
        placeholder="タグ"
        :reduce="(tag:any) => tag.id" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="md"
        @click.stop="openModal(NewTagModal)">
        タグを新規作成
      </simple-button>
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </simple-button>
    </div>
  </div>
</template>
