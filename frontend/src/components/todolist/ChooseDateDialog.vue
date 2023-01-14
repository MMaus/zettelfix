<template>
  <w-dialog
    :model-value="props.showDialog"
    @update:model-value="$emit('input', false)"
  >
    <w-card title="Choose time of next action">
      <div class="title5">
        {{ showDate() }} {{ showTime()
        }}<w-button class="ml5" @click="resetDate()">now</w-button>
      </div>

      <div class="text-left mt3">
        <h4>Delay by Days</h4>
        <div class="btn-group">
          <w-button
            v-for="inc in [1, 2, 4, 7, 28]"
            :key="inc"
            bg-color="primary"
            class="ma1"
            @click="incDate(inc)"
          >
            +{{ inc }}
          </w-button>
        </div>

        <div class="mt2">
          <h4>Time of day</h4>
          <div class="btn-group">
            <w-button bg-color="primary" class="mr2" @click="setTime(8, 0)">
              morning
            </w-button>
            <w-button bg-color="primary" @click="setTime(15, 0)">
              afternoon
            </w-button>
          </div>
        </div>
      </div>

      <template #actions>
        <div class="grow text-right">
          <w-button
            class="mr1"
            bg-color="warning"
            @click="$emit('input', false)"
          >
            Cancel
          </w-button>
          <w-button bg-color="success" @click="submit"> Choose </w-button>
        </div>
      </template>
    </w-card>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  showDialog: boolean;
  // date: Date;
  // time: Date;
  // loggedIn: boolean;
}>();

const emit = defineEmits<{
  (e: "date-chosen", date: Date): void;
  (e: "input", selectedInput: boolean): void;
}>();

const proposedDate = new Date();
proposedDate.setDate(proposedDate.getDate() + 1);
proposedDate.setHours(8);
proposedDate.setMinutes(0);
const selectedTime = ref(proposedDate);
const submit = () => {
  console.log("You entered " + selectedTime.value);
  emit("date-chosen", selectedTime.value);
};

const incDate = function (nDays: number) {
  const copy = new Date(selectedTime.value.getTime());
  copy.setDate(selectedTime.value.getDate() + nDays);
  console.log("updated date");
  selectedTime.value = copy;
};

const resetDate = function () {
  selectedTime.value = new Date();
};

const showDate = () => {
  // const formatter = new Intl.DateTimeFormat();
  // const formattedDate = formatter.format(selectedTime.value);
  // return "" + JSON.stringify(formattedDate); //selectedTime.value;
  const t = selectedTime.value;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // note that weeks start with Sundays!
  return (
    "" +
    days[t.getDay()] +
    ", " +
    t.getDate() +
    "." +
    (t.getMonth() + 1) +
    "." +
    t.getFullYear()
  );
};

const showTime = () => {
  const t = selectedTime.value;
  const daytime =
    "" + t.getHours() + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
  return daytime;
};

const setTime = (hours: number, minutes: number) => {
  console.log("function called with " + hours);
  console.log("function called with " + minutes);
  const currentDate = new Date(selectedTime.value);
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  selectedTime.value = currentDate;
};
</script>

<style>
.date-modal-mask {
  position: fixed;
  z-index: 9997;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.date-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.date-modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.date-modal-body {
  margin: 20px 0;
}

.date-modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.date-modal-enter {
  opacity: 0;
}

.date-modal-leave-active {
  opacity: 0;
}

.date-modal-enter .date-modal-container,
.date-modal-leave-active .date-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
