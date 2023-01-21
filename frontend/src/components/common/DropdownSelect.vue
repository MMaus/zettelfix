<template>
  <div class="relWidth">
    <w-input
      round
      shadow
      :label="props.label"
      :placeholder="props.placeholder"
      @update:model-value="searchTextChanged"
      :inner-icon-left="dropdownIcon"
      @click:inner-icon-left="toggleDropdown"
      inner-icon-right="mdi mdi-close-circle"
      @click:inner-icon-right="reset"
    ></w-input>
    <div v-show="showDropdown" class="dropdown-background relWidth">
      <w-drawer
        absolute
        top
        no-overlay
        v-model="showDropdown"
        height="40vh"
        @click="showDropdown = false"
        class="sh2"
      >
        <!-- <div class="bordered full-width"> -->
        <w-button
          @click.stop="showDropdown = false"
          icon="wi-cross"
          absolute
          sm
          outline
          round
          z-index="100"
        ></w-button>
        <slot></slot>
      </w-drawer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
const props = withDefaults(
  defineProps<{
    label: string;
    width?: string;
    placeholder?: string;
    searchText?: string;
    maxWidth?: string;
  }>(),
  {
    width: "100%",
    maxWidth: "600px",
    placeholder: undefined,
    searchText: "",
  }
);
const emit = defineEmits<{
  (eventName: "update:searchText", value: string): void;
}>();

const reset = () => {
  showDropdown.value = false;
  emit("update:searchText", "");
};
const overallWidth = props.width;
const overallMaxWidth = props.maxWidth;

const searchTextChanged = (val: string) => {
  showDropdown.value = true;
  emit("update:searchText", val);
};

const dropdownIcon = computed(() =>
  showDropdown.value ? "mdi mdi-chevron-up" : "mdi mdi-chevron-down"
);

const showDropdown = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 33%;
  transform-origin: top;
  transform: scaleY(0.5);
}

.relWidth {
  width: v-bind(overallWidth);
  max-width: v-bind(overallMaxWidth);
}
.dropdown-background {
  position: absolute;
  min-height: 132px;
  height: 40vh;
  z-index: 100;
  box-shadow: none;
}
</style>
