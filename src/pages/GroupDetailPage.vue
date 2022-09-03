<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import GroupDetail from '/@/components/groupDetail/GroupDetail.vue'
import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'
import apis from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

export interface GroupDetailType {
  id: string
  name: string
  description: string
  budget: number
  owners: string[]
  members: string[]
  created_at: string
  updated_at: string
}

const groupStore = useGroupStore()
const userStore = useUserStore()
const route = useRoute()
const id = toId(route.params.id)
const group = ref<GroupDetailType>()

const fetchGroup = async (id: string) => {
  try {
    group.value = (await apis.getGroupDetail(id)).data
    groupStore.isGroupFetched = true
  } catch (err) {
    alert(err)
  }
}
onMounted(() => {
  fetchGroup(id)
  if (!userStore.isUserFetched) {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <div v-if="group === undefined">loading...</div>
  <div
    v-else
    class="min-w-80 mx-auto flex h-full flex-col justify-between px-12 pt-4 md:flex-row">
    <group-detail class="md:w-3/4" :group="group" @fix-group="group = $event" />
    <div class="flex flex-col gap-8 py-4 md:w-1/4">
      <group-members :group="group" />
      <group-owners :group="group" />
    </div>
  </div>
</template>
