<script lang="ts" setup>
import { ref } from 'vue'

import StatusChangeModal from '/@/components/modal/StatusChangeModal.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestStatus } from '/@/components/shared/StatusChip.vue'
import type { RequestDetail, Status } from '/@/lib/apis'
import { isCreater, isAdmin } from '/@/lib/authorityCheck'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pushStatus', value: Status): void
}>()

const userStore = useUserStore()

const nextStatus = ref<RequestStatus>('')
const hasCreaterAuthority = isCreater(userStore.me, props.request.created_by)
const hasAdminAuthority = isAdmin(userStore.me)

const hasToSubmittedAuthority =
  (hasCreaterAuthority && props.request.status === 'fix_required') ||
  (hasAdminAuthority &&
    (props.request.status === 'fix_required' ||
      props.request.status === 'accepted'))
const hasToFixRequiredAuthority =
  hasAdminAuthority && props.request.status === 'submitted'
const hasToAcceptedAuthority =
  hasAdminAuthority && props.request.status === 'submitted'
const hasToRejectedAuthority =
  hasAdminAuthority && props.request.status === 'submitted'

function handlePushStatus(event: Status) {
  emit('pushStatus', event)
}
</script>

<template>
  <status-change-modal
    v-if="nextStatus !== ''"
    :next-status="nextStatus"
    :request="props.request"
    @close-modal="nextStatus = ''"
    @push-status="handlePushStatus($event)" />
  <div class="flex gap-4">
    <simple-button
      v-if="hasToSubmittedAuthority"
      font-size="sm"
      padding="sm"
      @click="nextStatus = 'submitted'">
      承認待ちにする
    </simple-button>
    <simple-button
      v-if="hasToFixRequiredAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="nextStatus = 'fix_required'">
      要修正にする
    </simple-button>
    <simple-button
      v-if="hasToAcceptedAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="nextStatus = 'accepted'">
      承認済みにする
    </simple-button>
    <simple-button
      v-if="hasToRejectedAuthority"
      font-size="sm"
      padding="sm"
      @click.stop="nextStatus = 'rejected'">
      却下する
    </simple-button>
  </div>
</template>
