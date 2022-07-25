<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import GroupDetail from '../components/GroupDetail/GroupDetail.vue'
import GroupMembers from '/@/components/GroupMembers.vue'
import GroupOwners from '/@/components/GroupOwners.vue'
import apis from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

interface GroupDetailType {
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
const group = ref<GroupDetailType>({
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'SysAd',
  description: 'SysAd班',
  budget: 250000,
  owners: ['mehm8128', 'mehm8128'],
  members: ['mehm8128', 'mehm8128'],
  created_at: '2022-04-05T14:02:15.431Z',
  updated_at: '2022-04-05T14:02:15.431Z'
})

const fetchGroup = async (id: string) => {
  try {
    group.value = (await apis.getGroupDetail(id)).data
    groupStore.isGroupFetched = true
  } catch (err: any) {
    alert(err.message)
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
  <div class="min-w-160 mx-auto flex h-full flex-col px-12 pt-4">
    <div class="flex h-full justify-between">
      <GroupDetail :group="group" />
      <div class="flex w-1/4 flex-col gap-8 py-4">
        <GroupMembers :group="group" />
        <GroupOwners :group="group" />
      </div>
    </div>
  </div>
</template>
