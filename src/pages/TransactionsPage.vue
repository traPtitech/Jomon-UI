<script lang="ts" setup>
import Transaction from '../components/Transaction.vue'
const transactions = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    target: 'hoge株式会社',
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      }
    ],
    group: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description: 'SysAd班',
      budget: 250000,
      created_at: '2022-02-09T14:03:53.278Z',
      updated_at: '2022-02-09T14:03:53.278Z'
    },
    created_at: '2022-02-09T14:03:53.278Z',
    updated_at: '2022-02-09T14:03:53.278Z'
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    amount: 1200,
    target: 'hoge株式会社',
    tags: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '2020講習会',
        description: '2020年度講習会',
        created_at: '2022-02-09T14:03:53.278Z',
        updated_at: '2022-02-09T14:03:53.278Z'
      }
    ],
    group: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description: 'SysAd班',
      budget: 250000,
      created_at: '2022-02-09T14:03:53.278Z',
      updated_at: '2022-02-09T14:03:53.278Z'
    },
    created_at: '2022-02-09T14:03:53.278Z',
    updated_at: '2022-02-09T14:03:53.278Z'
  }
]
</script>

<template>
  <dev class="flex justify-evenly">
    <dev class="min-w-80 min-h-80 text-center border-3">aaaa</dev>
    <dev class="border-3 min-w-150 w-3/5">
      <h1 class="text-center border">入出金記録</h1>
      <dev class="text-center border flex">
        <dev class="w-1/6">年 月 日</dev>
        <dev class="w-1/6">取引額</dev>
        <dev class="w-1/6">取引相手</dev>
        <dev class="w-1/6">取引グループ</dev>
        <dev class="w-1/3">タグ</dev>
      </dev>
      <ul>
        <li v-for="transaction in transactions" :key="transaction.id">
          <Transaction :transaction="transaction" />
        </li>
      </ul>
    </dev>
  </dev>
</template>
