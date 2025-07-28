import { createSlice } from "@reduxjs/toolkit";
import { 
  MEDICINE_ICON,
  LEAVES_ICON,
  SUN_ICON,
  SHUTTLECOCK_ICON,
  CRAYONS_ICON,
  CALENDAR_ICON
} from "../../data/icons";

// Stock topics with predefined IDs and appropriate icons
const stockTopics = {
  "science-topic": {
    id: "science-topic",
    name: "Science",
    icon: MEDICINE_ICON,
    quizIds: []
  },
  "nature-topic": {
    id: "nature-topic", 
    name: "Nature",
    icon: LEAVES_ICON,
    quizIds: []
  },
  "geography-topic": {
    id: "geography-topic",
    name: "Geography", 
    icon: SUN_ICON,
    quizIds: []
  },
  "sports-topic": {
    id: "sports-topic",
    name: "Sports",
    icon: SHUTTLECOCK_ICON,
    quizIds: []
  },
  "music-topic": {
    id: "music-topic",
    name: "Music",
    icon: CRAYONS_ICON,
    quizIds: []
  },
  "history-topic": {
    id: "history-topic",
    name: "History",
    icon: CALENDAR_ICON,
    quizIds: []
  }
};

const initialState = stockTopics;

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
