import { AppState } from "./app/types";
import { ShoppingListState } from "./shopping/types";
import { UserState } from "./user/types";

export interface JuteBagState {
  version: number;
  shopping: ShoppingListState;
  user: UserState;
  app: AppState;
}
