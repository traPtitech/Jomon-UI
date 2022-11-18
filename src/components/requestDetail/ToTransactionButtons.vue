<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const { request } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="py-8">
    <router-link
      v-if="userStore.isAdmin()"
      class=""
      :to="`/transactions/new?requestID=${request?.id}`">
      <SimpleButton font-size="md" padding="sm">
        この申請から入出金記録を作成する
      </SimpleButton>
    </router-link>
    <router-link :to="`/transactions?requestID=${request?.id}`">
      <SimpleButton font-size="md" padding="sm">
        この申請の入出金記録へ移動
      </SimpleButton>
    </router-link>
  </div>
</template>
