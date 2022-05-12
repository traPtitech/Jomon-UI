<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'

import StatusChangeModal from './modal/StatusChangeModal.vue'
import Button from './shared/Button.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <div class="flex gap-4">
    <Button
      v-if="
        requestDetailStore.request.status === 'fix_required' ||
        (userStore.me.admin && requestDetailStore.request.status === 'accepted')
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'submitted' })">
      承認待ちにする
    </Button>
    <Button
      v-if="
        userStore.me.admin && requestDetailStore.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="
        openModal(StatusChangeModal, { nextStatus: 'fix_required' })
      ">
      要修正にする
    </Button>
    <Button
      v-if="
        userStore.me.admin && requestDetailStore.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'accepted' })">
      承認済みにする
    </Button>
    <Button
      v-if="
        userStore.me.admin && requestDetailStore.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'rejected' })">
      却下する
    </Button>
  </div>
</template>
