<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import GroupDetail from '../components/GroupDetail.vue'
import GroupMembers from '../components/GroupMembers.vue'
import { useGroupStore } from '../stores/group'
import { useUserStore } from '../stores/user'

const groupStore = useGroupStore()
const userStore = useUserStore()
const route = useRoute()
const id = String(route.params.id)

onMounted(() => {
  groupStore.fetchGroups()
  userStore.fetchUsers()
})
</script>

<template>
  <div class="flex">
    <GroupDetail />
    <GroupMembers />
  </div>
</template>
