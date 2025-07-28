import { v4 as uuidv4 } from "uuid";
import { fetchTriviaQuestions, convertTriviaToFlashcard } from "../utils/triviaAPI";
import { addQuiz } from "../features/quizzes/quizzesSlice";
import { addCard } from "../features/cards/cardsSlice";
import { addQuizIdToTopic, selectAllTopics } from "../features/topics/topicsSlice";

// Topic display names for quiz titles
const TOPIC_NAMES = {
  'science-topic': 'Science',
  'nature-topic': 'Nature', 
  'geography-topic': 'Geography',
  'sports-topic': 'Sports',
  'music-topic': 'Music',
  'history-topic': 'History'
};

/**
 * Create a quiz with trivia questions for a specific topic
 * @param {string} topicId - The topic ID to create quiz for
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<string>} The created quiz ID
 */
export const createTriviaQuiz = async (topicId, dispatch) => {
  try {
    // Fetch trivia questions
    const triviaQuestions = await fetchTriviaQuestions(topicId, 10);
    
    // Create cards from trivia questions
    const cardIds = [];
    
    triviaQuestions.forEach(triviaQuestion => {
      const cardId = uuidv4();
      const flashcard = convertTriviaToFlashcard(triviaQuestion);
      
      cardIds.push(cardId);
      dispatch(addCard({
        id: cardId,
        front: flashcard.front,
        back: flashcard.back
      }));
    });
    
    // Create the quiz
    const quizId = uuidv4();
    const topicName = TOPIC_NAMES[topicId];
    
    dispatch(addQuiz({
      id: quizId,
      name: `${topicName} Trivia Quiz`,
      topicId: topicId,
      cardIds: cardIds
    }));
    
    // Add quiz to topic
    dispatch(addQuizIdToTopic({
      topicId: topicId,
      quizId: quizId
    }));
    
    return quizId;
  } catch (error) {
    console.error(`Failed to create trivia quiz for ${topicId}:`, error);
    throw error;
  }
};

/**
 * Populate all stock topics with trivia quizzes (only creates quizzes for topics that don't have any)
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} getState - Redux getState function to check existing state
 * @returns {Promise<Object>} Object with success/failure results
 */
export const populateStockQuizzes = async (dispatch, getState = null) => {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  const topicIds = Object.keys(TOPIC_NAMES);
  console.log('🔄 Starting to populate quizzes for topics:', topicIds);
  
  // If getState is provided, check which topics already have quizzes
  let topicsToProcess = topicIds;
  if (getState) {
    const state = getState();
    const topics = selectAllTopics(state);
    topicsToProcess = topicIds.filter(topicId => {
      const topic = topics[topicId];
      const hasQuizzes = topic && topic.quizIds.length > 0;
      if (hasQuizzes) {
        results.skipped.push({ topicId, reason: 'Already has quizzes' });
        console.log(`⏭️ Skipping ${TOPIC_NAMES[topicId]} - already has ${topic.quizIds.length} quiz(s)`);
      }
      return !hasQuizzes;
    });
  }
  
  console.log('📝 Topics to process:', topicsToProcess.map(id => TOPIC_NAMES[id]));
  
  // Create quizzes for each topic sequentially to avoid API rate limiting
  for (let i = 0; i < topicsToProcess.length; i++) {
    const topicId = topicsToProcess[i];
    try {
      console.log(`🔄 Creating quiz ${i + 1}/${topicsToProcess.length} for ${TOPIC_NAMES[topicId]} (${topicId})...`);
      
      // Wait longer between requests to be respectful to the API
      if (i > 0) {
        console.log('⏳ Waiting 1 second before next request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const quizId = await createTriviaQuiz(topicId, dispatch);
      results.success.push({ topicId, quizId });
      console.log(`✅ Successfully created trivia quiz for ${TOPIC_NAMES[topicId]} with ID: ${quizId}`);
    } catch (error) {
      results.failed.push({ topicId, error: error.message });
      console.error(`❌ Failed to create trivia quiz for ${TOPIC_NAMES[topicId]}:`, error);
      
      // Continue with next topic even if one fails
      console.log('🔄 Continuing with next topic...');
    }
  }
  
  console.log('📊 Final results:', results);
  return results;
};
