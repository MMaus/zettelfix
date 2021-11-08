<template>
  <div class="background" v-if="showBackground" @click="onBackgroundClicked">
    <div class="modal-wrapper">
      <transition>
        <div class="modal-container p-4 pt-5" v-if="showForeground" @click.stop>
          <div class="modal-content">
            <slot></slot>
          </div>
          <div class="d-flex">
            <div class="ml-auto button-slot">
              <slot name="buttons">
                <button
                  class="btn button btn-primary"
                  @click="signal('cancel')"
                >
                  Cancel
                </button>
                <button class="btn button btn-primary" @click="signal('ok')">
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const showForeground = ref(props.show);
    const showBackground = ref(props.show);
    function signal(signalName: string) {
      context.emit(signalName);
    }
    function onBackgroundClicked() {
      context.emit("background-click");
    }
    watch(
      () => props.show,
      (show) => {
        if (show) {
          showBackground.value = true;
          window.setTimeout(() => {
            showForeground.value = true;
          }, 20);
        } else {
          showForeground.value = false;
          window.setTimeout(() => {
            showBackground.value = false;
          }, 400);
        }
      }
    );
    return {
      signal,
      showForeground,
      showBackground,
      onBackgroundClicked,
    };
  },
});
</script>
<style scoped>
.background {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5000;
  height: 100%;
  width: 100%;
  background-color: rgba(48, 48, 48, 0.75);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  max-width: 80vw;
  border-radius: 10px;
  /* margin: 50px auto;
  padding: 20px 30px; */
  margin: auto;
  padding-bottom: 10px;
  margin-bottom: 10px;
  background-color: whitesmoke;
  /* -shadow: 0 2px 8px rgba(0, 0, 0, 0.33); */
  /* transition: all 0.3s ease; */
  font-family: Helvetica, Arial, sans-serif;
  /* overflow-y: scroll;
  max-height: 49vh; */
}

.modal-content {
  padding: 20px;
  /* background-color: whitesmoke; */
  /* box-shadow: 0 3px 3px rgba(0, 0, 0, 0.33); */
  overflow-y: scroll;
  max-height: 50vh;
}

.button-slot {
  margin-top: 10px;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-70vh);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-to,
.v-leave-from {
  transform: translateY(0);
}
</style>
