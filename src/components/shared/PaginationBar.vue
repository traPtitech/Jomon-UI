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
  <div v-if="itemLength !== 0" class="text-center w-full">
    <div class="flex justify-center">
      <router-link
        class="w-24 h-8 block hover:border flex justify-center items-center rounded-lg"
        :class="
          pageIndex === 1
            ? 'hover:border-zinc-300 bg-zinc-300 cursor-default'
            : 'hover:border-zinc-400'
        "
        :to="
          pageIndex === 1
            ? `/${kind}/?pageIndex=1`
            : `/${kind}/?pageIndex=` + (pageIndex - 1).toString()
        "
        ><span>前のページへ</span></router-link
      >
      <router-link
        v-for="index in Math.ceil(itemLength / unit) <= 8
          ? [...Array(Math.ceil(itemLength / unit)).keys()]
          : pageIndex >= 6
          ? [...Array(2).keys()]
          : [...Array(6).keys()]"
        :key="index"
        class="mr-2 ml-2 w-8 h-8 block hover:border hover:border-zinc-400 flex justify-center items-center rounded-lg"
        :class="index + 1 === pageIndex ? 'bg-blue-300 cursor-default' : ''"
        :to="`/${kind}/?pageIndex=` + (index + 1).toString()"
      >
        <span>{{ index + 1 }}</span></router-link
      >
      <span v-if="Math.ceil(itemLength / unit) >= 9">...</span>

      <router-link
        v-for="index in pageIndex <= 5 ? null : [...Array(5).keys()]"
        v-if="
          Math.ceil(itemLength / unit) >= 10 &&
          6 <= pageIndex &&
          pageIndex <= Math.ceil(itemLength / unit) - 5
        "
        class="mr-2 ml-2 w-8 h-8 block hover:border hover:border-zinc-400 flex justify-center items-center rounded-lg"
        :class="index === 2 ? 'bg-blue-300 cursor-default' : ''"
        :to="`/${kind}/?pageIndex=` + (index + pageIndex - 2).toString()"
      >
        <span>{{ index + pageIndex - 2 }}</span>
      </router-link>

      <span v-if="Math.ceil(itemLength / unit) >= 9">...</span>
      <router-link
        v-for="index in Math.ceil(itemLength / unit) <= 8
          ? null
          : pageIndex >= Math.ceil(itemLength / unit) - 4
          ? [...Array(6).keys()].reverse()
          : [...Array(2).keys()].reverse()"
        :key="index"
        class="mr-2 ml-2 w-8 h-8 block hover:border hover:border-zinc-400 flex justify-center items-center rounded-lg"
        :class="
          pageIndex === Math.ceil(itemLength / unit) - index
            ? 'bg-blue-300 cursor-default'
            : ''
        "
        :to="
          `/${kind}/?pageIndex=` +
          (Math.ceil(itemLength / unit) - index).toString()
        "
      >
        <span>{{ Math.ceil(itemLength / unit) - index }}</span></router-link
      >
      <router-link
        class="w-24 h-8 block hover:border hover:border-zinc-400 flex justify-center items-center rounded-lg"
        :class="
          pageIndex === Math.ceil(itemLength / unit)
            ? 'hover:border-zinc-300 bg-zinc-300 cursor-default'
            : 'hover:border-zinc-400'
        "
        :to="
          pageIndex !== Math.ceil(itemLength / unit)
            ? `/${kind}/?pageIndex=` + (pageIndex + 1).toString()
            : `/${kind}/?pageIndex=` + Math.ceil(itemLength / unit).toString()
        "
        ><span>次のページへ</span></router-link
      >
    </div>
  </div>
</template>
