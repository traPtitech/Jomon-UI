<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '../stores/group'
import UserIcon from './shared/UserIcon.vue'

const groupStore = useGroupStore()
const { group } = storeToRefs(groupStore)
</script>

<template>
  <div class="flex flex-col gap-12">
    <div>
      <h2>グループオーナー</h2>
      <ul>
        <li v-for="owner in group.owners" :key="owner">
          <UserIcon class="w-12 inline" :name="owner" />
          {{ owner }}
        </li>
      </ul>
    </div>
    <div>
      <h2>グループメンバー</h2>
      <ul>
        <li v-for="member in group.members" :key="member">
          <UserIcon class="w-12 inline" :name="member" />
          {{ member }}
        </li>
      </ul>
    </div>
  </div>
</template>
