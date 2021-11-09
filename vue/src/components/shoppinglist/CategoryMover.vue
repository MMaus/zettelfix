<template>
  <div class="p0 text-right">
    <span class="text-right">
      <w-button
        bg-color="purple-light2"
        class="white mr1 bdrs1"
        lg
        @click="pullCategory"
        icon="mdi mdi-arrow-up-bold-box-outline"
      >
        <!-- <svg
          width="1.5em"
          height="1.5em"
          viewBox="0 0 16 16"
          class="bi bi-arrow-up-square"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
          />
          <path
            fill-rule="evenodd"
            d="M4.646 8.354a.5.5 0 0 0 .708 0L8 5.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
          />
          <path
            fill-rule="evenodd"
            d="M8 11.5a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-1 0v5a.5.5 0 0 0 .5.5z"
          />
        </svg> -->
      </w-button>
      <w-button
        bg-color="purple-light2"
        lg
        class="white bdrs1"
        @click="pushCategory"
        icon="mdi mdi-arrow-down-bold-box-outline"
      >
        >
        <!-- <svg
          width="1.5em"
          height="1.5em"
          viewBox="0 0 16 16"
          class="bi bi-arrow-down-square"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
          />
          <path
            fill-rule="evenodd"
            d="M4.646 7.646a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"
          />
          <path
            fill-rule="evenodd"
            d="M8 4.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"
          />
        </svg> -->
      </w-button>
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent, SetupContext } from "vue";

export default defineComponent({
  setup(_: unknown, context: SetupContext) {
    return {
      pullCategory() {
        context.emit("pullCategory");
      },
      pushCategory() {
        context.emit("pushCategory");
      },
    };
  },
});
</script>
