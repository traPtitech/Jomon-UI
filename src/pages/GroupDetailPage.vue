<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useUserStore } from '/@/stores/user'

//used by decorater metadata.のせいでtype importできなくてバグってる
import apis, { GroupDetail } from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'

import GroupMembers from '/@/components/groupDetail/GroupMembers.vue'
import GroupOwners from '/@/components/groupDetail/GroupOwners.vue'

const route = useRoute()
const id = toId(route.params.id)

const userStore = useUserStore()

const group = ref<GroupDetail>()

const fetchGroup = async (id: string) => {
  try {
    group.value = (await apis.getGroupDetail(id)).data
  } catch (err) {
    alert(err)
  }
}

//await fetchGroup(id) swagger直ったら使う
group.value = (
  await axios.get(
    'http://localhost:3000/api/groups/3fa85f64-5717-4562-b3fc-2c963f66afa6'
  )
).data //swagger直ったら消す
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<template>
  <div
    v-if="group !== undefined"
    class="min-w-80 mx-auto flex h-full w-4/5 flex-col justify-between px-12 pt-4 md:flex-row">
    <GroupDetail class="md:w-3/4" :group="group" @fix-group="group = $event" />
    <div class="flex flex-col gap-8 py-4 md:w-1/4">
      <GroupMembers :group="group" />
      <GroupOwners :group="group" />
    </div>
  </div>
</template>
