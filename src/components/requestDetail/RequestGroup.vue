<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { computed } from 'vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)

const groupName = computed(() =>
  request.value?.group ? request.value.group.name : 'なし'
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <div class="text-sm font-bold">グループ</div>
      <EditButton v-if="hasAuthority" />
    </div>
    <div>
      {{ groupName }}
    </div>
  </div>
</template>
