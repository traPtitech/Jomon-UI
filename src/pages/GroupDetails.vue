<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import GroupDetail from '/@/components/GroupDetail.vue'
import GroupMembers from '/@/components/GroupMembers.vue'
import GroupOwners from '/@/components/GroupOwners.vue'
import { toId } from '/@/lib/parsePathParams'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const groupStore = useGroupStore()
const userStore = useUserStore()
const route = useRoute()
const id = toId(route.params.id)

onMounted(() => {
  groupStore.fetchGroup(id)
  if (!userStore.isUserFetched) {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <div class="flex flex-col mx-auto min-w-160 px-12 pt-4 h-full">
    <div class="flex justify-between h-full">
      <GroupDetail />
      <div class="flex flex-col gap-8 w-1/4 py-4">
        <GroupMembers />
        <GroupOwners />
      </div>
    </div>
  </div>
</template>
