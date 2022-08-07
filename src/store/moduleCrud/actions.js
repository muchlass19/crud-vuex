import { v4 as uuid } from "uuid";

export const clearState = ({ commit }) => {
  commit("setMerchantName", "");
  commit("setMerchantPhone", "");
  commit("setMerchantProduct", "");
};

export const getMerchantById = ({ state, commit }, id) => {
  const findMerchant = state.merchants.find((element) => element.id === id);
  commit("setMerchantName", findMerchant.merchantName);
  commit("setMerchantPhone", findMerchant.merchantPhone);
  commit("setMerchantProduct", findMerchant.merchantProduct);
};

export const addData = ({ commit }, payload) => {
  const id = uuid();
  commit("addMerchant", { id, ...payload });
};

export const editData = ({ state, commit }, { id, payload }) => {
  const index = state.merchants.findIndex((element) => element.id === id);
  commit("updateMerchant", { index, payload });
};

export const deleteData = ({ state, commit }, id) => {
  const findMerchant = state.merchants.map((element) => element.id).indexOf(id);
  commit("deleteMerchant", findMerchant);
};
