<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useRequestDetailStore } from '/@/stores/requestDetail'

import { toId } from '/@/lib/parseQueryParams'

import TagsGroup from '/@/components/shared/TagsGroup.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

const route = useRoute()
const id = toId(route.params.id)

const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)

await requestDetailStore.fetchRequestDetail(id)
</script>

<template>
  <div v-if="request !== undefined">
    <div class="mt-2 flex justify-between">
      <div class="flex items-center">
        グループ：
        <span v-if="request.group === undefined">なし</span>
        <span v-else>{{ request.group.name }}</span>
      </div>
      <div class="text-2xl">金額：{{ request.amount }}円</div>
    </div>
    <div class="mt-2">
      タグ：
      <span v-if="request.tags.length === 0">なし</span>
      <TagsGroup v-else :tags="request.tags" />
    </div>
    <div class="mt-4 flex items-center">
      払い戻し対象者：
      <div
        v-for="target in request.targets"
        :key="target.id"
        class="flex items-center">
        <UserIcon class="h-8" :name="target.id" />
        {{ target.id }}
      </div>
    </div>
  </div>
</template>
