<template>
  <q-page>
    <p class="q-pa-md text-h6">Form Penambahan Merchant</p>
    <table-vue />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import TableVue from "src/components/Table.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    TableVue,
  },
});
</script>
