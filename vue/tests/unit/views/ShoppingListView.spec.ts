import { mount, VueWrapper } from "@vue/test-utils";
import { createStore, Store } from "vuex";

import ShoppingListView from "@/views/ShoppingListView.vue";
import CategoryPanel from "@/components/shoppinglist/CategoryPanel.vue";
import ShoppingItemDisplay from "@/components/shoppinglist/ShoppingItemDisplay.vue";
import { JuteBagState } from "@/store/types";
import { createModule as createShoppingModule } from "@/store/shopping";
import { ShoppingItem } from "@/store/shopping/types";

describe("The ShoppingList", () => {
  let store: Store<JuteBagState>;
  let viewWrapper: VueWrapper<any>;

  async function addItem(itemName: string, categoryName: string) {
    await store.dispatch("shopping/addItem", {
      itemName,
      categoryName,
      inCart: false,
    });
  }

  beforeEach(() => {
    store = createStore({
      modules: {
        shopping: createShoppingModule(),
      },
    });
    viewWrapper = mount(ShoppingListView, {
      global: {
        plugins: [store],
      },
    });
  });

  it("display the store / load toolbar when user is logged in.", async () => {
    fail("test not implemented");
  });

  it("renders a new category panel when categories appear.", async () => {
    expect(viewWrapper.findAllComponents(CategoryPanel).length).toBe(0);
    await addItem("item1", "cat1");
    expect(viewWrapper.findAllComponents(CategoryPanel).length).toBe(1);
    await addItem("item2", "cat2");
    expect(viewWrapper.findAllComponents(CategoryPanel).length).toBe(2);
    await addItem("item3", "cat1");
    expect(viewWrapper.findAllComponents(CategoryPanel).length).toBe(2);
  });

  it("renders a shopping item for each item that is created.", async () => {
    await addItem("item1", "cat1");
    expect(viewWrapper.findAllComponents(ShoppingItemDisplay).length).toBe(1);
    await addItem("item2", "cat2");
    expect(viewWrapper.findAllComponents(ShoppingItemDisplay).length).toBe(2);
    await addItem("item3", "cat1");
    expect(viewWrapper.findAllComponents(ShoppingItemDisplay).length).toBe(3);
  });

  // TODO: think about moving this into a dedicated test, e.g. the component itself
  it("toggles the 'in cart' property of an item when the user clicks on it.", async () => {
    await addItem("item1", "cat1");
    const textDisplay = viewWrapper
      .findComponent(ShoppingItemDisplay)
      .find(".itemNameDisplay");
    expect(textDisplay.exists()).toBe(true);
    const theItem = store.getters["shopping/categories"][0]
      .items[0] as ShoppingItem;
    expect(theItem.inCart).toBe(false);
    await textDisplay.trigger("click");
    expect(theItem.inCart).toBe(true); // ACTUALLY this *only* works because the proxy returned from the getter is reactive!
  });

  it("changes the 'done' property of the category when all items are done", async () => {
    await addItem("item1", "cat1");
    expect(viewWrapper.findAllComponents(CategoryPanel).length).toBe(1);
    const categoryWrapper = viewWrapper.findComponent(CategoryPanel);
    expect(categoryWrapper.find(".category-done").exists()).toBeFalsy();
    expect(categoryWrapper.find(".storedItem").exists()).toBeFalsy();
    const itemNameDisplay = categoryWrapper.find(".itemNameDisplay");
    expect(itemNameDisplay.exists()).toBeTruthy();
    await itemNameDisplay.trigger("click");
    expect(categoryWrapper.find(".requiredItem").exists()).toBeFalsy();
    const newCatTitle = categoryWrapper.find(".category-done");
    expect(newCatTitle.exists).toBeTruthy();
    await newCatTitle.trigger("click");
    expect(categoryWrapper.find(".storedItem").exists()).toBeTruthy(); // may become false because category collapses
  });
});
