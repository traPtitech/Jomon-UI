<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import apis from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'
import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()

const addList = ref<string[]>([])
const deleteList = ref<string[]>([])
const hasAuthority = isAdmin(userStore.me)

onMounted(() => {
  if (userStore.me.admin) {
    if (!adminStore.isAdminFetched) {
      adminStore.fetchAdmins()
    }
    if (!userStore.isUserFetched) {
      userStore.fetchUsers()
    }
  }
})

const deleteAdmins = async () => {
  if (deleteList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    await apis.deleteAdmins(deleteList.value)
    adminStore.admins = adminStore.admins?.filter(
      id => !deleteList.value.includes(id)
    )
  } catch (err) {
    alert(err)
  }
}
const addAdmins = async () => {
  if (addList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    const res = (await apis.postAdmins(addList.value)).data
    if (adminStore.admins) {
      adminStore.admins.push(...res)
    } else {
      adminStore.admins = [res]
    }
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div v-if="!hasAuthority">権限がありません。</div>
  <div v-else class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <h1 class="pb-8 text-center text-3xl">管理ページ</h1>
    <div>
      <ul v-if="adminStore.admins" class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="rounded border border-black px-2 text-center">
            {{ admin }}
          </div>
        </li>
      </ul>
      <div v-else>loading...</div>
    </div>
    <div class="mt-4 flex gap-4">
      <vue-select
        v-model="addList"
        class="w-1/2"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="追加する管理者を選択"
        :reduce="(user:any) => user.name" />
      <simple-button font-size="lg" padding="sm" @click.stop="addAdmins">
        選択した管理者を追加
      </simple-button>
    </div>
    <div class="mt-12 flex gap-4">
      <vue-select
        v-model="deleteList"
        class="w-1/2"
        multiple
        :options="adminStore.admins"
        placeholder="削除する管理者を選択" />
      <simple-button font-size="lg" padding="sm" @click.stop="deleteAdmins">
        選択した管理者を削除
      </simple-button>
    </div>
  </div>
</template>
