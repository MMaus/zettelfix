// see https://github.com/vuejs/vue-test-utils-next/issues/194#issuecomment-695333180
// This is supposed to get the unit tests working
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent; //<{}, {}, any>
  // const component = DefineComponent; //<{}, {}, any> ... ?
  export default component;
}
