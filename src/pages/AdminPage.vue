<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import apis from '/@/lib/apis'
import { isAdmin } from '/@/lib/authorityCheck'
import { useAdminStore } from '/@/stores/admin'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const adminStore = useAdminStore()
const userStore = useUserStore()
const tagStore = useTagStore()

const addAdminList = ref<string[]>([])
const removeAdminList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const hasAuthority = isAdmin(userStore.me)

onMounted(() => {
  if (userStore.me.admin) {
    if (!adminStore.isAdminFetched) {
      adminStore.fetchAdmins()
    }
    if (!userStore.isUserFetched) {
      userStore.fetchUsers()
    }
    if (!tagStore.isTagFetched) {
      tagStore.fetchTags()
    }
  }
})

const addAdmins = async () => {
  if (addAdminList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    await apis.postAdmins(addAdminList.value)
    if (adminStore.admins) {
      adminStore.admins.push(...addAdminList.value)
    } else {
      adminStore.admins = addAdminList.value
    }
  } catch (err) {
    alert(err)
  }
}

const removeAdmins = async () => {
  if (removeAdminList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    await apis.deleteAdmins(removeAdminList.value)
    adminStore.admins = adminStore.admins?.filter(
      id => !removeAdminList.value.includes(id)
    )
  } catch (err) {
    alert(err)
  }
}

const deleteTags = async () => {
  if (deleteTagList.value.length === 0) {
    alert('1人以上選択して下さい')
    return
  }
  try {
    const deleteTagPromiseList = deleteTagList.value.map(tag =>
      tagStore.deleteTag(tag)
    )
    await Promise.all(deleteTagPromiseList)
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
      <ul class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="rounded border border-black px-2 text-center">
            {{ admin }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4 flex gap-4">
      <vue-select
        v-model="addAdminList"
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
        v-model="removeAdminList"
        class="w-1/2"
        multiple
        :options="adminStore.admins"
        placeholder="削除する管理者を選択" />
      <simple-button font-size="lg" padding="sm" @click.stop="removeAdmins">
        選択した管理者を削除
      </simple-button>
    </div>
    <div class="mt-24 flex gap-4">
      <vue-select
        v-model="deleteTagList"
        :close-on-select="false"
        class="w-1/2"
        multiple
        label="name"
        :options="tagStore.tags"
        placeholder="削除するタグを選択"
        :reduce="(tag:any) => tag.id" />
      <simple-button font-size="lg" padding="sm" @click.stop="deleteTags">
        選択したタグを削除
      </simple-button>
    </div>
  </div>
</template>
