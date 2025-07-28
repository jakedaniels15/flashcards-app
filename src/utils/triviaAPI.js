// Utility functions for fetching trivia questions from Open Trivia Database API

// Map our topics to Open Trivia DB category IDs
const TRIVIA_CATEGORIES = {
  'science-topic': 17, // Science & Nature
  'nature-topic': 17,  // Science & Nature (same as science)
  'geography-topic': 22, // Geography
  'sports-topic': 21,   // Sports
  'music-topic': 12,    // Entertainment: Music
  'history-topic': 23   // History
};

/**
 * Fetch trivia questions from Open Trivia Database
 * @param {string} topicId - The topic ID to get questions for
 * @param {number} amount - Number of questions to fetch (default: 10)
 * @returns {Promise<Array>} Array of trivia questions
 */
export const fetchTriviaQuestions = async (topicId, amount = 10) => {
  const categoryId = TRIVIA_CATEGORIES[topicId];
  
  if (!categoryId) {
    throw new Error(`No trivia category found for topic: ${topicId}`);
  }

  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple`;
  console.log(`🌐 Fetching trivia for ${topicId} from:`, url);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📦 API response for ${topicId}:`, data);
    
    if (data.response_code !== 0) {
      const errorMessages = {
        1: 'No Results - Could not return results. The API doesn\'t have enough questions for your query.',
        2: 'Invalid Parameter - Contains an invalid parameter. Arguements passed in aren\'t valid.',
        3: 'Token Not Found - Session Token does not exist.',
        4: 'Token Empty - Session Token has returned all possible questions for the specified query.'
      };
      
      const errorMsg = errorMessages[data.response_code] || `Unknown API error! response_code: ${data.response_code}`;
      throw new Error(errorMsg);
    }
    
    console.log(`✅ Successfully fetched ${data.results.length} questions for ${topicId}`);
    return data.results;
  } catch (error) {
    console.error(`❌ Error fetching trivia questions for ${topicId}:`, error);
    throw error;
  }
};

/**
 * Convert trivia question to flashcard format
 * @param {Object} triviaQuestion - Question from Open Trivia DB
 * @returns {Object} Flashcard with front and back
 */
export const convertTriviaToFlashcard = (triviaQuestion) => {
  // Decode HTML entities
  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const question = decodeHtml(triviaQuestion.question);
  const correctAnswer = decodeHtml(triviaQuestion.correct_answer);
  const incorrectAnswers = triviaQuestion.incorrect_answers.map(decodeHtml);
  
  // Create multiple choice options
  const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
  const choicesText = allAnswers.map((answer, index) => 
    `${String.fromCharCode(65 + index)}. ${answer}`
  ).join('\n');

  return {
    front: `${question}\n\n${choicesText}`,
    back: `Answer: ${correctAnswer}`
  };
};
