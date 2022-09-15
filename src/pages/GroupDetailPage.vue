<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import type { GroupDetail } from '/@/lib/apis'
import { toId } from '/@/lib/parsePathParams'

import GroupInformation from '/@/components/groupDetail/GroupInformation.vue'
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

await fetchGroup(id)
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<template>
  <div
    v-if="group !== undefined"
    class="min-w-80 mx-auto flex h-full w-4/5 flex-row pt-4">
    <GroupInformation
      class="w-3/4"
      :group="group"
      @fix-group="group = $event" />
    <div class="flex w-1/4 flex-col gap-8 py-4">
      <GroupMembers :group="group" @fix-group="group = $event" />
      <GroupOwners :group="group" @fix-group="group = $event" />
    </div>
  </div>
</template>
