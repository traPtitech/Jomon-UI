<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useToastStore } from '/@/stores/toast'
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
const toastStore = useToastStore()

const group = ref<GroupDetail>()

const fetchGroup = async (id: string) => {
  try {
    group.value = (await apis.getGroupDetail(id)).data
  } catch {
    toastStore.showToast({
      type: 'error',
      message: 'グループの取得に失敗しました'
    })
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
    class="min-w-96 mx-auto flex h-full w-4/5 flex-col pt-4 md:flex-row">
    <GroupInformation
      class="md:w-3/4"
      :group="group"
      @fix-group="group = $event" />
    <div class="flex flex-col gap-8 py-4 md:w-1/4">
      <GroupOwners :group="group" @fix-group="group = $event" />
      <GroupMembers :group="group" @fix-group="group = $event" />
    </div>
  </div>
</template>
