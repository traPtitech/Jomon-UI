<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <div>タグ</div>
      <EditButton v-if="hasAuthority" />
    </div>
    <div>
      <TagsGroup v-if="request?.tags" :tags="request.tags" />
      <span v-else>なし</span>
    </div>
  </div>
</template>
