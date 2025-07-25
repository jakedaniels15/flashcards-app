import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    addTopic: (state, action) => {
      const { id, name, icon } = action.payload;
      state[id] = {
        id,
        name,
        icon,
        quizIds: []
      };
    }
  }
});

export const { addTopic } = topicsSlice.actions;

// Selectors
export const selectAllTopics = (state) => state.topics;

export default topicsSlice.reducer;
