import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action) => {
      const { id, front, back } = action.payload;
      state[id] = {
        id,
        front,
        back
      };
    }
  }
});

export const { addCard } = cardsSlice.actions;

// Selectors
export const selectAllCards = (state) => state.cards;
export const selectCardById = (state, cardId) => state.cards[cardId];

export default cardsSlice.reducer;
