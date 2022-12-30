<template>
  <w-flex wrap>
    <todo-item
      v-for="todo in sortedList"
      :key="todo.label"
      :data="todo"
      @add-task="onAddTask"
      @clear-item="deleteTodoItem"
      @remove-task="deleteTodoTask"
      @raise-task="onRaiseTask"
      @date-changed="onDateChanged"
    />
    <todo-info class="xs12" v-if="sortedList.length == 0"></todo-info>
  </w-flex>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TodoItem } from "@/use/localApi";
import TodoItemComponent from "@/components/todolist/TodoItemComponent.vue";
import TodoInfo from "@/components/todolist/TodoInfo.vue";
import { mapGetters } from "vuex";

// const todoDao = new TodoDAO("todo_v1");

export default defineComponent({
  data: function () {
    return {
      showModal: false,
      userEmail: "",
      isLoggedIn: false,
    };
  },

  computed: {
    ...mapGetters("todo", ["getTodoItems"]),
    sortedList: function (): TodoItem[] {
      if (!this.getTodoItems) {
        console.log("===todoitems unclear");
        return [];
      }
      const itemListCopy = [...this.getTodoItems];
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

    deleteTodoTask: function (todoLabel: string, taskLabel: string) {
      this.$store.dispatch("todo/deleteTodoTask", {
        todoLabel,
        taskLabel,
      });
    },

    onAddTask: function (todoId: string, taskLabel: string) {
      this.$store.dispatch("todo/addTodoTask", {
        todoLabel: todoId,
        taskLabel: taskLabel,
      });
    },

    deleteTodoItem: function (todoId: string) {
      this.$store.dispatch("todo/deleteTodoItem", todoId);
    },

    onRaiseTask: function (todoLabel: string, taskLabel: string) {
      this.$store.dispatch("todo/raiseTask", { todoLabel, taskLabel });
    },

    onDateChanged: function (todoId: string, newDate: Date) {
      this.$store.dispatch("todo/changeDate", {
        todoLabel: todoId,
        newDate: newDate,
      });
      // const todoItem = todoDao.getItem(todoId);
      // if (todoItem) {
      //   todoItem.nextActionTime = newDate;
      //   todoDao.storeLocally();
      // }
    },

    onNewItem: function (newItem: string) {
      console.log("on new Item called.");
      console.log("newItem is: " + newItem);
      this.$store.dispatch("todo/createTodoItem", newItem);
      // if (newItem) {
      //   todoDao.createTodo(newItem);
      // }
      this.showModal = false;
    },
  },

  components: {
    "todo-item": TodoItemComponent,
    TodoInfo,
  },
});
</script>
