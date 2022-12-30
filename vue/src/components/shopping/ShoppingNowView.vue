<template>
  <w-card shadow title="Shopping now" title-class="amber-light5--bg">
    <div class="growcontainer">
      <div class="largeflex">
        <div class="scroll">
          <div class="demo sticky-top">Add shop</div>
          <ul>
            <li>foo</li>
            <li v-for="dat in data" :key="dat" class="my3">{{ dat }}</li>
            <li>bar</li>
          </ul>
          bar
        </div>
      </div>
    </div>
  </w-card>
</template>
<script setup lang="ts">
const data = [
  "foo",
  "bar",
  "baz",
  "dfs",
  "fofo",
  "dada",
  "bla",
  "blubb",
  "lorem",
  "dolor",
  "ipsum",
];
</script>
<style scoped>
.demo {
  background-color: khaki;
}

.growcontainer {
  display: flex;
  flex-direction: column;
  flex-flow: column;
  height: 75%;
  border: 1px solid greenyellow;
  max-height: 75%;
  margin: 1px;
  padding: 2px;
}

.largeflex {
  flex: 1 1 auto;
  flex-grow: 1;
  border: 1px solid rebeccapurple;
}

.scroll {
  /* max-height: 50vh; */
  overflow-y: scroll;
}

.sticky-top {
  position: sticky;
  top: 0;
}
</style>
