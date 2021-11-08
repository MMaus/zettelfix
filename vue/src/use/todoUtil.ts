
import { ref, Ref, reactive } from "vue";
import { TodoItem, TodoTask, TaskStatus} from "@/use/localApi";

/**
 * "Local" refers to the view model
 */
class LocalTodoItem implements TodoItem {

    constructor(label: string) {
        this.label = label;
    }

    label: string;
    taskList = [];
    nextActionTime = new Date();
}

/**
 * "Local" refers to the view model
 */
class LocalTodoTask implements TodoTask {

    constructor(label: string) {
        this.label = label;
    }

    label: string;

    status = TaskStatus.TODO;

}

class TodoDAO {
    
    readonly todoItemsReactive: Array<TodoItem> = reactive([]);

    private storeName: string;

    constructor(storeName: string) {
        this.storeName = "jutebag." + storeName;
        this.loadLocally();
    }

    createTodo(label: string) {
        this.todoItemsReactive.push(new LocalTodoItem(label));
        this.storeLocally();
    }

    getItem(todoId: string): TodoItem|undefined {
        // const item = this.todoItemsRef.value.find(item => item.label === todoId);
        const item = this.todoItemsReactive.find(item => item.label === todoId);
        return item;
    }

    removeByLabel(todoId: string) {
    //   const copyWithout = todoDao.todoItemsReactive.filter(item => item.label != todoId);
      let count = 0;
      while(count < this.todoItemsReactive.length) {
          if (this.todoItemsReactive[count].label == todoId) {
              this.todoItemsReactive.splice(count, 1);
          }
        count++;
      }
      this.storeLocally();
    }

    /**
     * Write the data to local storage
     */
    storeLocally() {
        console.log("storing locally...");
        const stringified = JSON.stringify(this.todoItemsReactive);
        console.log("Stringified todoItems (from ref):" + stringified);
        localStorage.setItem(this.storeName, stringified);
        console.log("Stored todo items to localStorage");
    }

    /**
     * Read the data from local storage
     */
    loadLocally() {
        try {
            const storedContent = localStorage.getItem(this.storeName);
            if (storedContent) {
                const parsedContent = JSON.parse(storedContent);
                if (Array.isArray(parsedContent)) {
                    this.todoItemsReactive.length = 0;
                    parsedContent.forEach(it => this.todoItemsReactive.push(it))
                }

            } else {
                console.warn("No local todo item store found.");
            }
        } catch(error) {
            console.log("ERROR during initialization of todo list data" + error);
        }
    }

    upload(userEmail: string) {
        /* FIXME: create proper data format class or the like, see shopping list */
        const uploadData = {
            'version' : 1, /* stub for now */
            'tasks' : this.todoItemsReactive
        };

        const stringifiedData = JSON.stringify(uploadData);
        console.log("Sending POST with " + stringifiedData);
        fetch("/bagpy/todo/" + userEmail, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: stringifiedData
        })
            .then((res) => res.json())
            .then((json) =>
                console.log("received POST result:" + JSON.stringify(json))
            )
            .catch((err) => console.log("POST error: " + err));
    }

    download(userEmail: string) {
      console.log("downloading todo list for " + userEmail );
      console.log("querying items for " + userEmail);
      fetch("/bagpy/todo/" + userEmail)
        .then((res) => res.json())
        .then((json) => {
            console.log("TODO DOWNLOAD: received " + JSON.stringify(json));
            this.setNewItems(json['tasks']);
        })
        .catch((err) => console.log(err));
    }

    private setNewItems(items: Array<TodoItem>) {
        console.log("setting todolist to " + JSON.stringify(items));
        this.todoItemsReactive.length = 0;
        items.forEach(it => this.todoItemsReactive.push(it))
    }

}


export {
    LocalTodoItem,
    LocalTodoTask,
    TodoDAO
}