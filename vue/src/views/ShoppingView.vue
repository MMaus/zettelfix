<template>
  <div>
    <div class="pa1">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName" mode="default">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.switchToRight-leave-active,
.switchToRight-enter-active,
.switchToLeft-leave-active,
.switchToLeft-enter-active {
  transition: all 0.33s ease-out;
}

.switchToRight-enter-from {
  position: absolute;
  /* right: -100%; */
  left: 100%;
  width: 100vw;
  /* border: 10px solid black; */
}

.switchToRight-enter-to,
.switchToLeft-enter-to {
  position: absolute;
  left: 0%;
  width: 100vw;
  /* border: 10px solid gainsboro; */
}

.switchToRight-leave-from,
.switchToLeft-leave-from {
  position: absolute;
  left: 0%;
  width: 100%;
}

.switchToRight-leave-to {
  position: absolute;
  left: -100%;
  width: 100%;
}

.switchToLeft-enter-from {
  position: absolute;
  /* right: -100%; */
  left: -100%;
  width: 100vw;
  /* border: 10px solid black; */
}

.switchToLeft-leave-to {
  position: absolute;
  left: 100%;
  width: 100%;
}
</style>
