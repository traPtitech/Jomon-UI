<script lang="ts" setup>
import Button from '/@/components/shared/Button.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <div class="flex">
    払い戻し対象者：
    <div v-if="!(requestDetailStore.editMode === 'targets')">
      <span
        v-for="target in requestDetailStore.request.targets"
        :key="target.id">
        {{ target.target }},
      </span>
      <EditButton
        v-if="requestDetailStore.request.created_by === userStore.me.name"
        @click="requestDetailStore.changeEditMode('targets')" />
    </div>
    <div v-if="requestDetailStore.editMode === 'targets'">
      <VueSelect
        v-model="requestDetailStore.editedValue.targets"
        class="w-100"
        :close-on-select="false"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="払い戻し対象者"
        :reduce="(user:any) => user.name" />
      <Button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </Button>
    </div>
  </div>
</template>
