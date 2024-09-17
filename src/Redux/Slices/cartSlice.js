import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalAmount: 0,
};

const MAX_QUANTITY = 20;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        if (existingItem.quantity < MAX_QUANTITY) {
          existingItem.quantity += 1;
          state.totalAmount += product.productPrice;
        }
      } else {
        state.items.push({ ...product, quantity: 1 });
        state.totalAmount += product.productPrice;
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(
        (item) => item.id === id
      );
      if (itemToUpdate) {
        const difference = quantity - itemToUpdate.quantity;
        if (quantity <= MAX_QUANTITY) {
          itemToUpdate.quantity = quantity;
          state.totalAmount += difference * itemToUpdate.productPrice;
        } else {
          itemToUpdate.quantity = MAX_QUANTITY;
          state.totalAmount +=
            (MAX_QUANTITY - itemToUpdate.quantity) * itemToUpdate.productPrice;
        }
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const itemToRemove = state.items.find(
        (item) => item.id === id
      );
      if (itemToRemove) {
        state.totalAmount -= itemToRemove.productPrice * itemToRemove.quantity;
        state.items = state.items.filter(
          (item) => item.id !== id
        );
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;

export default cartSlice.reducer;
