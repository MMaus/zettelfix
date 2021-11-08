import { mount } from "@vue/test-utils";
import ShoppingCategory from "@/components/ShoppingCategory.vue";
import { Category } from "@/use/localApi";
import { Emitter } from "mitt";
// import jest from 'jest'
// import Greeting from "@/components/Greeting.vue";

describe("ShoppingCategory", () => {
  it("should render a list of its passed items", () => {
    const msg = "new message";
    const wrapper = mount(ShoppingCategory, {
      props: {
        category: {
          id: 1,
          name: "Cat1",
          items: [],
          isDone: false,
        },
        categorylist: [],
        mitt: {
          on: jest.fn(),
        },
      },
    });
    expect(wrapper.html().includes("Cat1")).toBe(true);
  });
});
