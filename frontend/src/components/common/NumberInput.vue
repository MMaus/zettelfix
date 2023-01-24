<template>
  <w-input
    class="numberinput text-center"
    :min="0"
    type="number"
    maxlength="3"
    max="999"
    :model-value="props.modelValue"
    inner-icon-right="mdi mdi-menu-up"
    @click:inner-icon-right="increase"
    inner-icon-left="mdi mdi-menu-down"
    @click:inner-icon-left="decrease"
    @input="update"
  ></w-input>
</template>
<script setup lang="ts">
import { isNumber } from "lodash";

const props = defineProps<{
  modelValue: number;
}>();
const emit = defineEmits<{
  (eventName: "update:model-value", value: number): void;
}>();

const increase = () => {
  if (isNumber(props.modelValue) && props.modelValue >= 0) {
    emit("update:model-value", props.modelValue + 1);
  } else {
    emit("update:model-value", 0);
  }
};

const decrease = () => {
  if (isNumber(props.modelValue) && props.modelValue > 0) {
    emit("update:model-value", props.modelValue - 1);
  } else {
    emit("update:model-value", 0);
  }
};

// TODO: FIXME: forbid non-number inputs

let lastValue = props.modelValue;

const update = (newValue: number) => {
  if (!isNumber(newValue)) {
    console.log("not a number:", newValue);
    emit("update:model-value", lastValue);
  } else {
    emit("update:model-value", newValue);
    lastValue = newValue;
  }
};
</script>
<style scoped>
.numberinput {
  width: 6rem;
}

.numberinput :deep(input[type="number"]) {
  -moz-appearance: textfield !important;
}

.numberinput :deep(input::-webkit-outer-spin-button),
.numberinput :deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
  margin: 0 !important;
}
</style>
