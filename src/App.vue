<template>
  <main>
    <header class="shadow min-h-12">
      <div class="flex gap-2">
        <router-link to="/requests"><div>申請一覧</div></router-link>
        <router-link to="/transactions"><div>入出金記録一覧</div></router-link>
        <router-link to="/groups"><div>グループ一覧</div></router-link>
      </div>
    </header>

    <router-view />
  </main>
</template>
