<template>
  <form-vue
    class="q-pa-md q-gutter-sm"
    buttonColor="primary"
    buttonLabel="Add"
    @add-data="addData"
  />
  <div class="q-pa-md">
    <q-table
      title="Data"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr>
          <q-td>{{ props.row.merchantName }}</q-td>
          <q-td>{{ props.row.merchantPhone }}</q-td>
          <q-td>{{ props.row.merchantProduct }}</q-td>
          <q-td class="row">
            <form-vue
              class="q-mx-xs"
              buttonColor="warning"
              buttonLabel="Edit"
              :rowId="props.row.id"
              @edit-data="editData"
            />
            <q-btn
              label="Delete"
              color="negative"
              @click="deleteData(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUpdated } from "vue";
import { useStore } from "vuex";
import FormVue from "./Form.vue";

const columns = [
  {
    name: "merchantName",
    label: "Nama Merchant",
    field: "merchantName",
    align: "left",
    sortable: true,
  },
  {
    name: "merchantPhone",
    label: "Nomor Telepon Merchant",
    field: "merchantPhone",
    align: "left",
    sortable: true,
  },
  {
    name: "merchantProduct",
    label: "Nama Produk Merchant",
    field: "merchantProduct",
    align: "left",
    sortable: true,
  },
  {
    name: "",
    label: "Action",
    align: "left",
    field: "",
  },
];

export default {
  name: "TableComponent",
  components: {
    FormVue,
  },
  setup() {
    const $store = useStore();
    const rows = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10,
    });

    // get data from state
    const originalRows = computed(() => {
      return $store.getters["crud/getMerchants"];
    });

    // local function
    const fetchFromServer = (startRow, count, filter, sortBy, descending) => {
      const data = filter
        ? originalRows.value.filter((row) =>
            row.merchantName.toLowerCase().includes(filter)
          )
        : originalRows.value.slice();

      // handle sortBy
      if (sortBy) {
        const sortFn =
          sortBy === "desc"
            ? descending
              ? (a, b) =>
                  a.merchantName > b.merchantName
                    ? -1
                    : a.merchantName < b.merchantName
                    ? 1
                    : 0
              : (a, b) =>
                  a.merchantName > b.merchantName
                    ? 1
                    : a.merchantName < b.merchantName
                    ? -1
                    : 0
            : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
        data.sort(sortFn);
      }

      return data.slice(startRow, startRow + count);
    };
    const getRowsNumberCount = (filter) => {
      if (!filter) {
        return originalRows.value.length;
      }
      let count = 0;
      console.log(typeof originalRows.value, originalRows);
      originalRows.value.forEach((element) => {
        if (element.merchantName.includes(filter)) {
          ++count;
        }
      });
      return count;
    };
    const onRequest = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        pagination.value.rowsNumber = getRowsNumberCount(filter);

        // get all rows if "All" (0) is selected
        const fetchCount =
          rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage;

        // fetch data from "server"
        const returnedData = fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        );

        // clear out existing data and add new
        rows.value.splice(0, rows.value.length, ...returnedData);

        // don't forget to update local pagination object
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;

        // ...and turn of loading indicator
        loading.value = false;
      }, 1500);
    };
    const callbackOnRequest = () => {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
    };
    const addData = async (value) => {
      console.log(value);
      await $store.dispatch("crud/addData", value);
      callbackOnRequest();
    };
    const editData = async (value) => {
      console.log(value);
      await $store.dispatch("crud/editData", {
        id: value.rowId,
        payload: value.newData,
      });
      callbackOnRequest();
    };
    const deleteData = async (id) => {
      await $store.dispatch("crud/deleteData", id);
      callbackOnRequest();
    };

    onMounted(() => {
      // get initial data from server (1st page)
      callbackOnRequest();
    });

    return {
      filter,
      loading,
      pagination,
      columns,
      rows,
      originalRows,

      onRequest,
      callbackOnRequest,
      addData,
      editData,
      deleteData,
    };
  },
};
</script>
