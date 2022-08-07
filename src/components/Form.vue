<template>
  <div>
    <q-btn :label="buttonLabel" :color="buttonColor" @click="popup = true" />

    <q-dialog v-model="popup" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ buttonLabel }} Merchant</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Nama Merchant</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined dense v-model="merchantName" autofocus />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Nomor Telepon Merchant</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined dense v-model="merchantPhone" autofocus />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Produk Merchant</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined dense v-model="merchantProduct" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            color="negative"
            label="Cancel"
            v-close-popup
            @click="cancel()"
          />
          <q-btn
            color="primary"
            :label="`${buttonLabel} merchant`"
            v-close-popup
            @click="updateData()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, onBeforeUpdate, ref } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    buttonLabel: {
      type: String,
      default: "Add",
    },
    buttonColor: {
      type: String,
      default: "primary",
    },
    rowId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const $store = useStore();

    const merchantName = computed({
      get: () => {
        return $store.getters["crud/getMerchantName"];
      },
      set: (value) => {
        $store.commit("crud/setMerchantName", value);
      },
    });

    const merchantPhone = computed({
      get: () => {
        return $store.getters["crud/getMerchantPhone"];
      },
      set: (value) => {
        $store.commit("crud/setMerchantPhone", value);
      },
    });

    const merchantProduct = computed({
      get: () => {
        return $store.getters["crud/getMerchantProduct"];
      },
      set: (value) => {
        $store.commit("crud/setMerchantProduct", value);
      },
    });

    const getDataById = async (id) => {
      await $store.dispatch("crud/getMerchantById", id);
    };

    const updateData = async () => {
      const newData = {
        merchantName: merchantName.value,
        merchantPhone: merchantPhone.value,
        merchantProduct: merchantProduct.value,
      };

      emit("addData", newData);
      emit("editData", { newData, rowId: props.rowId });
    };

    const cancel = () => {
      $store.dispatch("crud/clearState");
    };

    onBeforeUpdate(() => {
      if (props.rowId) {
        getDataById(props.rowId);
      } else {
        cancel();
      }
    });

    return {
      popup: ref(false),
      merchantName,
      merchantPhone,
      merchantProduct,

      updateData,
      cancel,
    };
  },
};
</script>
