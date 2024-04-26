<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import RequestTarget from '/@/components/requestDetail/RequestTarget.vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div>払い戻し対象者</div>
      <EditButton v-if="hasAuthority" />
    </div>
    <div class="flex flex-col gap-2">
      <RequestTarget
        v-for="target in request?.targets"
        :key="target.target"
        :target="target" />
    </div>
  </div>
</template>
