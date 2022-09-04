<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
}

const props = defineProps<Props>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const formattedTargets = props.request.targets
  .map(target => target.id)
  .join(', ')
const hasAuthority = isCreater(userStore.me, props.request.created_by)
</script>

<template>
  <div class="flex">
    <div v-if="!(requestDetailStore.editMode === 'targets')">
      払い戻し対象者：
      {{ formattedTargets }}
      <edit-button
        v-if="hasAuthority"
        @click="requestDetailStore.changeEditMode('targets')" />
    </div>
    <div v-if="requestDetailStore.editMode === 'targets'">
      払い戻し対象者：
      <vue-select
        v-model="requestDetailStore.editedValue.targets"
        class="inline-block w-2/3"
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
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </simple-button>
    </div>
  </div>
</template>
