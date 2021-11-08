<template>
  <transition name="date-modal">
    <div class="date-modal-mask">
      <div class="date-modal-wrapper">
        <div class="date-modal-container border">
          <div class="date-modal-header">
            <slot name="header"> Choose next action time </slot>
          </div>
          <div>{{ showDate() }}</div><div>{{ showTime() }}</div>

          <div class="date-modal-body">
            <!-- "snooze selection" with exponential zoom -->
            <!-- -->
            <div>
                <button class="btn bg-secondary text-white pm-0" @click="resetDate()">now</button>
            </div>
            <div>
            Day
              <div class="btn-group">
                <button class="btn bg-secondary text-white pm-0" @click="incDate(1)">+1</button>
                <button class="btn bg-primary text-white pm-0" @click="incDate(2)">+2</button>
                <button class="btn bg-primary text-white pm-0" @click="incDate(5)">+5</button>
                <button class="btn bg-primary text-white pm-0" @click="incDate(7)">+7</button>
                <button class="btn bg-primary text-white pm-0" @click="incDate(28)">+28</button>
              </div>
            </div>


            <div class="mt-2">
              Time
            <div class="btn-group">
              <button class="btn bg-secondary text-white pm-0" @click="setTime(8, 0)">morning</button>
              <button class="btn bg-primary text-white pm-0" @click="setTime(15, 0)">afternoon</button>
            </div>
            </div>


          </div>

          <div class="date-modal-footer">
              <button class="btn bg-success text-white" @click="submit">
            <slot name="footer">
                Choose
            </slot>
              </button>
          </div>
          <div><hr></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    const proposedDate = new Date();
    proposedDate.setDate(proposedDate.getDate() + 1);
    proposedDate.setHours(8);
    proposedDate.setMinutes(0);
    const selectedTime = ref(proposedDate);
    const submit = () => {
      console.log("You entered " + selectedTime.value);
      emit("close", selectedTime.value);
    };

    const incDate = function(nDays: number) {
      const copy = new Date(selectedTime.value.getTime());
      copy.setDate(selectedTime.value.getDate() + nDays);
      console.log("updated date")
      selectedTime.value = copy;
    }

    const resetDate = function() {
      selectedTime.value = new Date();
    }

    const showDate = () => {
      // const formatter = new Intl.DateTimeFormat();
      // const formattedDate = formatter.format(selectedTime.value);
      // return "" + JSON.stringify(formattedDate); //selectedTime.value;
      const t = selectedTime.value;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // note that weeks start with Sundays!
      const daytime = "" + t.getHours() + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
      return "" + days[t.getDay()] + ", " + t.getDate() + "." + (t.getMonth() + 1) + "." + t.getFullYear();
    };

    const showTime = () => {
      const t = selectedTime.value;
      const daytime = "" + t.getHours() + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
      return daytime;
    };

    const setTime = (hours: number, minutes: number) => {
      console.log("function called with " + hours)
      console.log("function called with " + minutes)
      const currentDate = new Date(selectedTime.value);
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      selectedTime.value = currentDate;
    };

    return {
      submit,
      showDate,
      showTime,
      incDate,
      setTime,
      resetDate
    };
  },
});
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

.date-modal-header h3 {
  margin-top: 0;
  color: #42b983;
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