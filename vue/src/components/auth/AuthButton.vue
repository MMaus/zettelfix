<template>
  <w-button @click="onClick" class="ma2 pa2" :bg-color="buttonColor" shadow>
    <w-icon xl>mdi mdi-account</w-icon>
  </w-button>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const loggedIn = computed(() => store.getters["app/userLoggedIn"]);
    return {
      name: "AuthButton",
      buttonColor: computed(() => (loggedIn.value ? "success" : "grey")),
      onClick() {
        console.log("Button clicked");
      },
    };
  },
});
</script>
