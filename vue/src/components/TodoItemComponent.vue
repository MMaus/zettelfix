<template>
  <div class="p-1 m-2">
    <div class="card border todo-background">
      <div class="card-header text-left" v-bind:class="{due : isDue(), overdue: isOverdue()}"> 
        <div class="row">
          <div class="col">
            <span class="category-title">{{ data.label }}</span><br>
            <span class="category-date">Next action {{ formatDate() }}</span>
          </div>
          <div class="col">
            <span class="float-right">
              <div class="btn-group">
                <button class="btn border" @click="deleteItem">
                  <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-x-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
                <button class="btn border" @click="showActionTime">
                  <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-alarm" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z"/>
                  </svg>
                </button>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div class="card-body text-left">
          <div v-for="task in tasks" :key="task.label"><button class="btn bg-danger" @click="remove(task.label)">X</button><span class="m-3">{{task.label}}</span><button class="btn bg-info" @click="raise(task.label)">!</button></div>
          <span class="float-right">
            <button class="btn border" @click="toggleShowAdd">
              <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-patch-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.273 2.513l-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>
                <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8z"/>
              </svg>
          </button>
        </span>
        <div v-if="showAdd" class="input-group">
          <input type="text" ref="newTask"
            v-on:keyup.enter="addTask"
            placeholder="add new task">
          <button class="btn bg-secondary" @click="addTask">add</button>

        </div>
      </div>
    </div>
    <choose-date-modal v-if="showDateModal" @close="onNewDate">
  
    </choose-date-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { TodoTask, TodoItem } from "@/use/localApi";

import { LocalTodoItem, LocalTodoTask } from "@/use/todoUtil";
import ChooseDateModal from './ChooseDateModal.vue';

export default defineComponent({

  setup(props, context) {

    console.log("props:" + props.data);
    console.log("props.data:" + JSON.stringify(props));
    console.log("context.data:" + JSON.stringify(context));

    const showAdd = ref(true);

    const newTask: Ref<null | HTMLInputElement> = ref(null); // will be set by Vue

    const tasks: Ref<Array<TodoTask>> = ref(props.data.taskList);
    // props.data.tasks = ref([]); // Ref<Array<TodoTask>> = ref([]);
    // const tasks = props.data.tasks;
    
    const showDateModal: Ref<boolean> = ref(false);

    const deleteItem = function() {
      context.emit("clear-item", props.data.label);
    }

    const showActionTime = function() {
      console.log("show action time modal");
      showDateModal.value = true; 
    }

    const addTask = function() {
      if (newTask.value?.value) {
        const taskLabel = newTask.value!.value;
        console.log("taskLabel = " + taskLabel)
        const item = new LocalTodoTask(taskLabel);
      //  taskList); tasks.value.push(item);
        context.emit("data-change", props.data.label, taskLabel);
        // props.data.tasks.push(item);
      }
      showAdd.value = false;
    }

    const getRemainingSeconds = () => {
      const myDate = new Date(props.data.nextActionTime); //props.data.nextActionTime;

      console.log("Date = " + myDate);
      console.log("Date (string)= " + JSON.stringify(myDate));

      const remainingSeconds: number = Math.round(myDate.getTime() - Date.now()) / 1000;
      return remainingSeconds;
    }

    const formatDate = function(): string {

      let remainingSeconds = getRemainingSeconds()
      const isDue = remainingSeconds < 0;
      let result = isDue ? "due since " : "in ";
      remainingSeconds = Math.abs(remainingSeconds);
      if (remainingSeconds <  60 * 60 * 24) { // less than one day => return hh:mm

        const hours = Math.floor(remainingSeconds / (60 * 60));
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        if (hours != 0) {
          result += "" + hours + "h "
        }
        result += "" + minutes + "m "
      } else {  // more than one day => return only days
        // FIXME: this should actually count mightnight crossings! e.g. from Friday evening to Sunday morning its 2 days.
        // Q: from Friday evening to Saturday morning, do we want to display "1 day" or e.g. "12h:03m"?
        const days = Math.round(remainingSeconds / (60 * 60 * 24));
        result += "" + days + " days"
      }
      // date.
      return result;
    }

    const isDue = () => {
      return getRemainingSeconds() < 0;
    }

    const isOverdue = () => {
      return getRemainingSeconds() < -1 * 3600 * 24; // more than 24 overdue
    }

    const remove = (taskLabel: string) => {
      let idx = 0;
      while(idx < tasks.value.length) {
        if (tasks.value[idx].label === taskLabel) {
          tasks.value.splice(idx, 1);
        }
        idx++;
      }
      // tasks.value.filter(val => val.label != itemText)
      // tasks.value = copy
      console.log("removing " + taskLabel);
      context.emit("remove-task", props.data.label, taskLabel);
    }

    const raise = (taskLabel: string) => {
      console.log("raising " + taskLabel);
      let idx = 0;
      while(idx < tasks.value.length) {
        if (tasks.value[idx].label === taskLabel) {
          const itemToRaise = tasks.value.splice(idx, 1)[0];
          tasks.value.splice(0, 0, itemToRaise);
          break;
        }
        idx++;
      }
      context.emit("rearranged-tasks", props.data.label);
    }

    const onNewDate = function(newDate: any) {
      console.log("on New Date: " + newDate);
      showDateModal.value = false;
      context.emit("date-changed", props.data.label, newDate);
    }

    const toggleShowAdd = () => {
      showAdd.value = !showAdd.value;
    }

    return {
      // refs (connection to input elements)
      newTask,
      // data
      tasks,
      showAdd,
      // methods
      addTask,
      deleteItem,
      showActionTime,
      formatDate,
      onNewDate,
      showDateModal,
      toggleShowAdd,
      remove,
      raise,
      isDue,
      isOverdue
    }
  },

  components: {
    "choose-date-modal" : ChooseDateModal
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
  },


});
</script>

<style scoped>
.todo-background {
  background-color: #ffddaa;
}
.category-title {
  text-transform: capitalize;
  font-size: 120%;
  font-weight: bold;
}
.category-date {
  white-space: nowrap;
  font-size: 90%;
  font-weight: bold;
}
.category-done {
  background-color: papayawhip;
}

.due {
  background-color: gold;
}

.overdue {
  background-color: crimson;
}


</style>
