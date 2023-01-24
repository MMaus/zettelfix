<template>
  <div @keyup.esc="showDropdown = false" ref="anchorElement" class="base">
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
    <div
      class="dropdown-background sh2 px2"
      :class="{ expanded: showDropdown }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, Ref, ref } from "vue";
const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    searchText?: string;
    bg_color?: string;
  }>(),
  {
    label: "",
    placeholder: undefined,
    searchText: "",
    bg_color: "white",
  }
);
const emit = defineEmits<{
  (eventName: "update:searchText", value: string): void;
}>();

const reset = () => {
  showDropdown.value = false;
  emit("update:searchText", "");
};

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

const anchorElement = ref(null) as Ref<HTMLElement | null>;
const onclick = (evt: Event) => {
  if (evt.target) {
    if (!anchorElement.value?.contains(evt.target as HTMLElement)) {
      if (showDropdown) {
        showDropdown.value = false;
      }
    }
  }
};

onMounted(() => window.addEventListener("click", onclick));
onUnmounted(() => window.removeEventListener("click", onclick));
</script>
<style scoped>
.base {
  position: relative;
}

/* height cannot be animated - maxheight can */
.dropdown-background {
  position: absolute;
  z-index: 100;
  width: 100%;
  background-color: v-bind(bg_color);
  max-height: 0;
  overflow: hidden;
  transition: all 0.2s;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.expanded {
  max-height: 40vh;
  min-height: 30px;
  overflow-y: scroll;
}
</style>
