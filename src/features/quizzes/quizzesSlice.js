import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    addQuiz: (state, action) => {
      const { id, name, topicId, cardIds } = action.payload;
      state[id] = {
        id,
        name,
        topicId,
        cardIds
      };
    }
  }
});

export const { addQuiz } = quizzesSlice.actions;

// Selectors
export const selectAllQuizzes = (state) => state.quizzes;
export const selectQuizById = (state, quizId) => state.quizzes[quizId];

export default quizzesSlice.reducer;
