<template>
  <div class="xs12 md6 lg4">
    <w-card class="ma4 purple-light5--bg" :title-class="titleClass">
      <template #title>
        <w-flex>
          <div class="text-left px2 pt1" :class="titleClass">
            <span
              class="title2"
              :class="{ indigo: isDue() && !isOverdue(), white: isOverdue() }"
              >{{ data.label }}</span
            >
          </div>
          <div class="spacer"></div>
          <div class="text-right" :class="titleClass">
            <w-button
              xl
              icon="mdi mdi-clock"
              color="purple"
              bg-color="white"
              class="bdrs1 ma1"
              @click="showActionTime"
            ></w-button>
            <w-button
              xl
              color="warning"
              bg-color="white"
              icon="mdi mdi-close-box-outline"
              class="bdrs1"
              @click="deleteItem"
            ></w-button>
          </div>
        </w-flex>
      </template>

      <span class="title5"> Next action {{ formatDate() }}</span>

      <div class="p-1 m-2">
        <div class="text-left">
          <!-- <w-flex wrap> -->
          <transition-group tag="div" name="task-list">
            <div
              v-for="task in tasks"
              :key="task.label"
              class="xs12 pa2 my1 todo-background"
            >
              <w-flex>
                <w-button bg-color="error" @click="remove(task.label)">
                  <w-icon xl>mdi mdi-delete-forever</w-icon>
                </w-button>
                <span class="title4 mt2 ml3">{{ task.label }}</span>
                <div class="spacer"></div>
                <w-button bg-color="primary" @click="raise(task.label)">
                  <w-icon>mdi mdi-chevron-double-up</w-icon>
                </w-button>
              </w-flex>
            </div>
          </transition-group>
          <!-- </w-flex> -->

          <w-flex class="mt2">
            <w-input
              round
              shadow
              input
              type="text"
              v-model="newTask"
              v-on:keyup.enter="addTask"
              placeholder="add new task"
            />
            <w-button bg-color="primary" @click="addTask">add</w-button>
          </w-flex>
        </div>
        <choose-date-dialog v-model="showDateModal" @date-chosen="onNewDate">
        </choose-date-dialog>
      </div>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, Ref } from "vue";
import { TodoTask, TodoItem } from "@/use/localApi";

import ChooseDateDialog from "./ChooseDateDialog.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "clear-item", label: string): void;
  (e: "data-change", todoLabel: string, task: string): void;
  (e: "remove-task", todoLabel: string, task: string): void;
  (e: "rearranged-tasks", todoLabel: string): void;
  (e: "date-changed", todoLabel: string, date: Date): void;
}>();

// console.log("props:" + props.data);
// console.log("props.data:" + JSON.stringify(props));
// console.log("context.data:" + JSON.stringify(context));

const newTask = ref(""); // will be set by Vue
const tasks: Ref<Array<TodoTask>> = ref(props.data.taskList);
// props.data.tasks = ref([]); // Ref<Array<TodoTask>> = ref([]);
// const tasks = props.data.tasks;

const showDateModal: Ref<boolean> = ref(false);

const deleteItem = function () {
  emit("clear-item", props.data.label);
};

const showActionTime = function () {
  console.log("show action time modal");
  showDateModal.value = true;
};

const addTask = function (evt: Event) {
  evt.stopPropagation();
  if (newTask.value) {
    const taskLabel = newTask.value;
    console.log("taskLabel = " + taskLabel);
    newTask.value = "";
    emit("data-change", props.data.label, taskLabel);
    // props.data.tasks.push(item);
  }
};

const getRemainingSeconds = () => {
  const myDate = new Date(props.data.nextActionTime);
  const remainingSeconds: number =
    Math.round(myDate.getTime() - Date.now()) / 1000;
  return remainingSeconds;
};

const formatDate = function (): string {
  let remainingSeconds = getRemainingSeconds();
  const isDue = remainingSeconds < 0;
  let result = isDue ? "due since " : "in ";
  remainingSeconds = Math.abs(remainingSeconds);
  if (remainingSeconds < 60 * 60 * 24) {
    // less than one day => return hh:mm

    const hours = Math.floor(remainingSeconds / (60 * 60));
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    if (hours != 0) {
      result += "" + hours + "h ";
    }
    result += "" + minutes + "m ";
  } else {
    // more than one day => return only days
    // FIXME: this should actually count mightnight crossings! e.g. from Friday evening to Sunday morning its 2 days.
    // Q: from Friday evening to Saturday morning, do we want to display "1 day" or e.g. "12h:03m"?
    const days = Math.round(remainingSeconds / (60 * 60 * 24));
    result += "" + days + " days";
  }
  // date.
  return result;
};

const isDue = () => {
  return getRemainingSeconds() < 0;
};

const isOverdue = () => {
  return getRemainingSeconds() < -1 * 3600 * 24; // more than 24 overdue
};

const remove = (taskLabel: string) => {
  let idx = 0;
  while (idx < tasks.value.length) {
    if (tasks.value[idx].label === taskLabel) {
      tasks.value.splice(idx, 1);
    }
    idx++;
  }
  console.log("removing " + taskLabel);
  emit("remove-task", props.data.label, taskLabel);
};

const raise = (taskLabel: string) => {
  console.log("raising " + taskLabel);
  let idx = 0;
  while (idx < tasks.value.length) {
    if (tasks.value[idx].label === taskLabel) {
      const itemToRaise = tasks.value.splice(idx, 1)[0];
      tasks.value.splice(0, 0, itemToRaise);
      break;
    }
    idx++;
  }
  emit("rearranged-tasks", props.data.label);
};

const onNewDate = function (newDate: Date) {
  showDateModal.value = false;
  emit("date-changed", props.data.label, newDate);
};

const titleClass = computed(() => {
  return isOverdue() ? "_todo-overdue" : isDue() ? "_todo-due" : "";
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

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease-in-out;
}

.task-list-move {
  transition: transform 0.5s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
<style>
/* NOT scoped - due to an issue with Wave UI and class binding - not sure if I would call this a bug or a misunderstanding from my side */
._todo-due {
  background-color: gold !important;
}

._todo-overdue {
  background-color: crimson !important;
}
</style>
