import { AppState } from "./app/types";
import { ShoppingListState } from "./shopping/types";
import { TodoListState } from "./todo/types";
import { UserState } from "./user/types";

// FIXME: Find proper name!
export interface JuteBagState {
  version: number;
  shopping: ShoppingListState;
  todo: TodoListState;
  user: UserState;
  app: AppState;
}
