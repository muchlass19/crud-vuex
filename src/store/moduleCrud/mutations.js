export const setMerchantName = (state, payload) => {
  state.merchantName = payload;
};

export const setMerchantPhone = (state, payload) => {
  state.merchantPhone = payload;
};

export const setMerchantProduct = (state, payload) => {
  state.merchantProduct = payload;
};

export const addMerchant = (state, payload) => {
  state.merchants.push(payload);
};

export const updateMerchant = (state, { index, payload }) => {
  console.log(index, payload);
  state.merchants[index].merchantName = payload.merchantName;
  state.merchants[index].merchantPhone = payload.merchantPhone;
  state.merchants[index].merchantProduct = payload.merchantProduct;
};

export const deleteMerchant = (state, payload) => {
  state.merchants.splice(payload, 1);
};
