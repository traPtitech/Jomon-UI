<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import GroupInformation from '/@/components/groupDetail/GroupInformation.vue'
import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

await groupDetailStore.fetchGroup(id)
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<template>
  <div class="min-w-80 mx-auto flex h-full w-4/5 flex-row pt-4">
    <GroupInformation class="w-3/4" />
    <div class="flex w-1/4 flex-col gap-8 py-4">
      <GroupMembers />
      <GroupOwners />
    </div>
  </div>
</template>
