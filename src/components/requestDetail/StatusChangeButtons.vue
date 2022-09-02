<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'

import SimpleButton from '../shared/SimpleButton.vue'
import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'
import type{RequestDetail} from '/@/lib/apis'

interface Props{
  request: RequestDetail
}

const props=defineProps<Props>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <div class="flex gap-4">
    <simple-button
      v-if="
        props.request.status === 'fix_required' ||
        (userStore.me!.admin && props.request.status === 'accepted')
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'submitted' })">
      承認待ちにする
    </simple-button>
    <simple-button
      v-if="
        userStore.me!.admin && props.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="
        openModal(StatusChangeModal, { nextStatus: 'fix_required' })
      ">
      要修正にする
    </simple-button>
    <simple-button
      v-if="
        userStore.me!.admin && props.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'accepted' })">
      承認済みにする
    </simple-button>
    <simple-button
      v-if="
        userStore.me!.admin && props.request.status === 'submitted'
      "
      font-size="sm"
      padding="sm"
      @click.stop="openModal(StatusChangeModal, { nextStatus: 'rejected' })">
      却下する
    </simple-button>
  </div>
</template>