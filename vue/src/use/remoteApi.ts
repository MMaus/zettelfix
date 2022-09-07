/**
 * Interfaces for jutebag backend.
 * Must be kept in sync with remote interfaces.!
 */

interface RemoteSaveRequest {
  email: string;
  items: Array<RemoteShoppingItem>;
  categories: Array<RemoteCategory>;
  revision: number;
}

interface RemoteShoppingItem {
  id: number;
  name: string;
  qty: number;
  category: string; // grouped by category,
  stored: boolean;
}

interface RemoteCategory {
  id: number;
  name: string;
}

export type { RemoteSaveRequest, RemoteCategory, RemoteShoppingItem };
