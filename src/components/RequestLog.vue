<script lang="ts" setup>
import { useRequestDetailStore } from '../stores/requestDetail'
import Icon from './Icon.vue'
import MarkdownIt from './MarkdownIt.vue'
import StatusChip from './StatusChip.vue'

const requestDetailStore = useRequestDetailStore()
type Props = { kind: string; index: number }
const props = defineProps<Props>()
</script>

<template>
  <div class="m-2">
    <div v-if="kind === 'comment'" class="border border-solid border-gray-400">
      <div class="flex justify-between">
        <span class="flex">
          <Icon
            :name="requestDetailStore.request.comments[props.index].user"
            class="ml-2 mt-2"
          />
          <span class="ml-2 mt-2">
            {{
              requestDetailStore.request.comments[props.index].user
            }}がコメントしました。</span
          >
        </span>
        <span class="mr-2 mt-2">{{
          requestDetailStore.dateFormatter(
            requestDetailStore.request.comments[props.index].created_at
          )
        }}</span>
      </div>
      <div class="ml-12 mb-2">
        コメント：<MarkdownIt
          :text="requestDetailStore.request.comments[props.index].comment"
          class="inline-block"
        />
      </div>
    </div>
    <div v-if="kind === 'statusChange'" class="w-9/10 ml-8 flex">
      <Icon
        :name="requestDetailStore.request.statuses[props.index].created_by"
        class="mr-2"
      />
      <span
        >{{
          requestDetailStore.request.statuses[props.index].created_by
        }}が申請の状態を</span
      >
      <StatusChip
        :status="requestDetailStore.request.statuses[props.index].status"
      />
      <span>にしました。</span>
      <span class="ml-4">{{
        requestDetailStore.dateFormatter(
          requestDetailStore.request.statuses[props.index].created_at
        )
      }}</span>
    </div>
  </div>
</template>
