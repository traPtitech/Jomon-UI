<script lang="ts" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import GroupDetail from '/@/components/groupDetail/GroupDetail.vue'
import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'
import apis from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'
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

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()

const group = ref<GroupDetailType>()

const fetchGroup = async (id: string) => {
  try {
    group.value = (await apis.getGroupDetail(id)).data
  } catch (err) {
    alert(err)
  }
}

onMounted(async () => {
  fetchGroup(id)
  group.value = (await axios.get('http://localhost:3000/api/groups/1')).data
  if (!userStore.isUserFetched) {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <div
    v-if="group !== undefined"
    class="min-w-80 mx-auto flex h-full w-4/5 flex-col justify-between px-12 pt-4 md:flex-row">
    <group-detail class="md:w-3/4" :group="group" @fix-group="group = $event" />
    <div class="flex flex-col gap-8 py-4 md:w-1/4">
      <group-members :group="group" />
      <group-owners :group="group" />
    </div>
  </div>
</template>
