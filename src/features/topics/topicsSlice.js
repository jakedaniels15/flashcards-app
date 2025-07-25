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
    },
    addQuizIdToTopic: (state, action) => {
      const { topicId, quizId } = action.payload;
      if (state[topicId]) {
        state[topicId].quizIds.push(quizId);
      }
    }
  }
});

export const { addTopic, addQuizIdToTopic } = topicsSlice.actions;

// Selectors
export const selectAllTopics = (state) => state.topics;

export default topicsSlice.reducer;
