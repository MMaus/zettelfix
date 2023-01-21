<template>
  <div class="relWidth">
    <w-input
      :label="props.label"
      :placeholder="props.placeholder"
      @update:model-value="searchTextChanged"
      @click:inner-icon-right="toggleDropdown"
      :inner-icon-right="dropdownIcon"
    ></w-input>
    <div v-show="showDropdown" class="dropdown relWidth">
      <w-drawer
        absolute
        top
        no-overlay
        v-model="showDropdown"
        height="40vh"
        @click="showDropdown = false"
        class="sh2 bdrs2 bd2"
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
  }>(),
  {
    width: "50%",
    placeholder: undefined,
    searchText: "",
  }
);
const emit = defineEmits<{
  (eventName: "update:searchText", value: string): void;
}>();
const overallWidth = props.width;

const searchTextChanged = (val: string) => {
  showDropdown.value = true;
  console.log("Value = ", val);
  emit("update:searchText", val);
};

const dropdownIcon = computed(() =>
  showDropdown.value ? "mdi mdi-chevron-up" : "mdi mdi-chevron-down"
);

const showDropdown = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  console.log("DROPDOwn vIS:", showDropdown.value);
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
}
.w-50 {
  width: 50%;
}
.dropdown {
  position: absolute;
  min-height: 132px;
  z-index: 100;
}
</style>
