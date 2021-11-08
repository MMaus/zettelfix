<template>
  <div>
    <div class="jumbotron">
      <h1>About JuteBag</h1>
      <p class="lead">
        JuteBag is a shopping list application. Developed as a toy project, I
        intend to explore as many technologies as possible while at the same
        time creating some useful application.
      </p>
      <p>
        Despite being a toy project, it aims for usability as well. However, it
        is not intended for production yet, that is, data loss may occur at any
        time, especially due to incompatible updates. That's not a bug, just
        expected behaviour.
      </p>
    </div>
    <button @click="toggleDialog" class="btn btn-primary button">
      toggle dialog
    </button>
    <teleport to="body">
      <modal-dialog :show="showDialog" @background-click="showDialog = false">
        <div>
          This is the main text
        </div>
        <template v-slot:buttons>
          <div>
            <button class="btn btn-primary" @click="toggleDialog">
              Try to close this!
            </button>
          </div>
        </template>
      </modal-dialog>
    </teleport>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import ModalDialog from "@/components/common/ModalDialog.vue";
export default {
  setup() {
    const showDialog = ref(false);
    function toggleDialog() {
      showDialog.value = !showDialog.value;
    }
    return {
      showDialog,
      toggleDialog,
    };
  },
  components: {
    ModalDialog,
  },
};
</script>
<style scoped>
/* li {
  text-align: center;
  border: 1px solid salmon;
  background-color: gainsboro;
  padding: 1rem;
  margin: 0.1rem;
}

.t1-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.5);
}

.t1-enter-active {
  transition: all 5s ease-out;
}

.t1-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.t1-leave-from {
  background-color: red;
}

.t1-leave-to {
  opacity: 0.5;
  transform: translateX(-100px) scale(0.2) rotate(180deg);
}

.t1-leave-active {
  transition: all 5s ease-in;
}

.t2-enter-from,
.t2-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.5);
}

.t2-enter-to,
.t2-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.t2-enter-active {
  transition: all 0.8s ease-out;
} */

/* .t2-leave-active {
  transition: all 0.9s ease-in-out;
  position: absolute; /* to enable smooth list changes */
/* } */

/* for transition-group only! */
/* .t2-move {
  transition: transform 0.8s ease;
} */
</style>
