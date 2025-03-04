<script setup>
import {RouterView, useRoute} from "vue-router"
import SvgIcon from '@/components/common/svg.vue'

const $route = useRoute()
</script>

<template>
  <div>
    <transition name="router-fade" mode="out-in">
      <KeepAlive>
        <RouterView v-if="!$route.meta.keepAlive"></RouterView>
      </KeepAlive>
    </transition>
    <SvgIcon></SvgIcon>
  </div>
</template>

<style scoped lang="scss">
@use "./style/common.scss";
.router-fade-enter-active, .router-fade-leave-active {
  transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
  opacity: 0;
}
</style>
