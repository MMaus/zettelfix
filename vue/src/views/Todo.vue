<template>
  <div id="todoComp">
    <div class="d-sm-flex flex-wrap border">
      <todo-item
        v-for="todo in sortedList"
        :key="todo.label"
        :data="todo"
        @data-change="onDataChage"
        @clear-item="onClearItem"
        @remove-task="onRemoveTask"
        @rearranged-tasks="onRearrangedTasks"
        @date-changed="onDateChanged"
      />
    </div>
    <div>
      <h4>Howto TODO-List</h4>
      <ul>
        <li>Click "+" to create a new TODO item</li>
        <li>Every item has a list of associated tasks</li>
        <li>
          There is always one task to do next. Click on the blue button to mark
          it as "do next".
        </li>
        <li>
          There is one time associated with each TODO item, the "time for next
          action". Click on the timer to set it.
        </li>
      </ul>
    </div>
    <div
      class="p-2 fixed-bottom text-right float-right bg-secondary text-white"
    >
      <button
        class="btn bg-light"
        :class="{ 'bg-warning': isLoggedIn, 'text-muted': !isLoggedIn }"
        @click="storeRemote"
      >
        save
      </button>
      <button
        class="btn bg-light"
        :class="{ 'bg-warning': isLoggedIn, 'text-muted': !isLoggedIn }"
        @click="loadRemote"
      >
        load
      </button>
      <button class="btn bg-primary text-white" @click="openModal">
        <svg
          width="2em"
          height="2em"
          viewBox="0 0 16 16"
          class="bi bi-patch-plus"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.273 2.513l-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"
          />
          <path
            fill-rule="evenodd"
            d="M8 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"
          />
          <path
            fill-rule="evenodd"
            d="M7.5 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8z"
          />
        </svg>
      </button>
    </div>

    <add-todo-modal v-if="showModal" @close="onNewItem"> </add-todo-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddTodoModal from "@/components/AddTodoModal.vue";
import { TodoDAO, LocalTodoTask } from "@/use/todoUtil";
import { TodoItem } from "@/use/localApi";
import TodoITemComponent from "@/components/TodoItemComponent.vue";

const todoDao = new TodoDAO("todo_v1");

export default defineComponent({
  data: function () {
    return {
      showModal: false,
      userEmail: "",
      isLoggedIn: false,
    };
  },

  computed: {
    sortedList: function (): TodoItem[] {
      if (!todoDao.todoItemsReactive) {
        console.log("===todoitems unclear");
        return [];
      }
      const itemListCopy = [...todoDao.todoItemsReactive];
      console.log("RENDERING LIST: " + JSON.stringify(itemListCopy));
      itemListCopy.sort(
        (a, b) =>
          new Date(a.nextActionTime).getTime() -
          new Date(b.nextActionTime).getTime()
      );
      return itemListCopy;
    },
  },

  methods: {
    openModal: function () {
      console.log("opening modal dialog");
      this.showModal = true;
    },

    storeRemote: function () {
      if (this.userEmail) {
        todoDao.upload(this.userEmail);
        console.log("storing remotely");
      } else {
        console.error("user not logged in / email not verified");
      }
    },

    loadRemote: function () {
      if (this.userEmail) {
        console.log("fetching items from remote for " + this.userEmail);
        todoDao.download(this.userEmail);
      } else {
        console.error("user not logged in / user not verified");
      }
    },

    onRemoveTask: function (todoId: string) {
      console.log("removed task from " + todoId + ". now storing stuff");
      todoDao.storeLocally();
    },

    onDataChage: function (todoId: string, todoText: string) {
      console.log("Data changed in " + todoId + " - " + todoText);
      const todoTask = new LocalTodoTask(todoText);
      const todoItem = todoDao.getItem(todoId);
      console.log("retrieved item " + todoItem);
      todoItem?.taskList.push(todoTask);
      if (todoItem) {
        todoDao.storeLocally();
      }
    },

    onClearItem: function (todoId: string) {
      console.log("requested to clear " + todoId);
      todoDao.removeByLabel(todoId);
    },

    onRearrangedTasks: function () {
      console.log("tasks rearranged, storing locally");
      todoDao.storeLocally();
    },

    onDateChanged: function (todoId: string, newDate: Date) {
      const todoItem = todoDao.getItem(todoId);
      if (todoItem) {
        todoItem.nextActionTime = newDate;
        todoDao.storeLocally();
      }
    },

    onNewItem: function (newItem: string) {
      console.log("on new Item called.");
      console.log("newItem is: " + newItem);
      if (newItem) {
        todoDao.createTodo(newItem);
      }
      this.showModal = false;
    },
  },

  components: {
    "add-todo-modal": AddTodoModal,
    "todo-item": TodoITemComponent,
  },
});
</script>

<style>
#todoComp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
