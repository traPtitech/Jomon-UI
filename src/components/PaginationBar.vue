<script lang="ts" setup>
type Props = {
  pageIndex: number
  itemLength: number
  unit: number
  kind: string
} //pageIndexはページ番号(routeから取ってくる)、itemLengthは全体の要素数(storeのgettersで計算)、unitは1ページに表示している個数(自分で決められるが、v-forで回す数と一致させる)、kindは"requests"や"transactions"や"groups"などパスで使う名前
const props = defineProps<Props>()
</script>
<template>
  <div class="text-center w-full">
    <div class="flex justify-center">
      <router-link
        class="w-24 h-8 block border border-solid border-black"
        :class="pageIndex === 1 ? 'bg-gray-200 cursor-default' : ''"
        :to="
          pageIndex !== 1
            ? `/${kind}/?pageIndex=` + (pageIndex - 1).toString()
            : `/${kind}/?pageIndex=1`
        "
        ><span class=""> 前のページへ </span></router-link
      >
      <router-link
        v-for="index in [
          ...Array(Math.ceil(itemLength / unit) + 1).keys()
        ].slice(1)"
        :key="index"
        class="mr-2 ml-2 w-8 h-8 block border border-solid border-black"
        :class="index === pageIndex ? 'bg-blue-300 cursor-default' : ''"
        :to="`/${kind}/?pageIndex=` + index.toString()"
      >
        <span>{{ index }}</span></router-link
      >
      <router-link
        class="w-24 h-8 block border border-solid border-black"
        :class="pageIndex === Math.ceil(itemLength / unit) ? 'bg-gray-200' : ''"
        :to="
          pageIndex !== Math.ceil(itemLength / unit)
            ? `/${kind}/?pageIndex=` + (pageIndex + 1).toString()
            : `/${kind}/?pageIndex=` + Math.ceil(itemLength / unit).toString()
        "
        ><span class=""> 次のページへ </span></router-link
      >
    </div>
  </div>
</template>
