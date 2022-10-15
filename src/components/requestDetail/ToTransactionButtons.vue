<script setup lang="ts">
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <div class="px-1/6 flex flex-col items-center gap-4 py-8">
    <router-link
      v-if="userStore.isAdmin()"
      class="w-full"
      :to="`/transactions/new?requestID=${requestDetailStore.request?.id}`">
      <SimpleButton class="w-full" font-size="md" padding="sm">
        この申請から入出金記録を作成する
      </SimpleButton>
    </router-link>
    <router-link
      class="w-full"
      :to="`/transactions?requestID=${requestDetailStore.request?.id}`">
      <SimpleButton class="w-full" font-size="md" padding="sm">
        この申請の入出金記録へ移動
      </SimpleButton>
    </router-link>
  </div>
</template>
