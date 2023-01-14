/**
 * This is the current remote interface.
 *
 * TODO: replace with more recent version!
 * (simply overwrite remote data)
 */
export interface RemoteCategory {
  id: number;
  name: string;
}

export interface RemoteItem {
  category: string;
  id: number;
  name: string;
  qty: number;
  stored: boolean;
}

export interface RemoteShoppingList {
  revision: number;
  categories: Array<RemoteCategory>;
  items: Array<RemoteItem>;
}
