<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import PartitionList from '@/components/partitions/PartitionList.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useUserStore } from '@/features/user/store'

const { isAccountManager } = useUserStore()
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="relative flex w-full flex-wrap items-center gap-x-7 gap-y-2">
      <h1 class="text-2xl">パーティション一覧</h1>
      <div v-if="isAccountManager" class="flex gap-3">
        <RouterLink to="/partitions/new">
          <SimpleButton font-size="lg" padding="md">
            パーティションを作成
          </SimpleButton>
        </RouterLink>
        <RouterLink to="/partitions/newGroup">
          <SimpleButton font-size="lg" padding="md">
            パーティショングループを作成
          </SimpleButton>
        </RouterLink>
      </div>
    </div>

    <PartitionList />
  </div>
</template>
