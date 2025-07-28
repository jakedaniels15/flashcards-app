import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import { selectAllTopics } from "./topicsSlice";
import { populateStockQuizzes } from "../../utils/populateQuizzes";
import { useStore } from "react-redux";

export default function Topics() {
  const topics = useSelector(selectAllTopics);
  const dispatch = useDispatch();
  const store = useStore();
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationStatus, setPopulationStatus] = useState(null);

  const handlePopulateQuizzes = async () => {
    setIsPopulating(true);
    setPopulationStatus(null);
    
    try {
      const results = await populateStockQuizzes(dispatch, store.getState);
      const totalProcessed = results.success.length + results.failed.length;
      const message = totalProcessed === 0 
        ? `All topics already have quizzes! (${results.skipped.length} skipped)`
        : `Successfully created ${results.success.length} trivia quiz${results.success.length !== 1 ? 'es' : ''}! ${results.failed.length > 0 ? `(${results.failed.length} failed)` : ''} ${results.skipped.length > 0 ? `(${results.skipped.length} skipped)` : ''}`;
      
      setPopulationStatus({
        type: 'success',
        message
      });
    } catch (error) {
      setPopulationStatus({
        type: 'error',
        message: 'Failed to populate quizzes. Please check the console for details.'
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <section className="center">
      <h1>Topics</h1>
      
      {/* Population status message */}
      {populationStatus && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: populationStatus.type === 'success' ? '#d4edda' : '#f8d7da',
          color: populationStatus.type === 'success' ? '#155724' : '#721c24',
          borderRadius: '4px',
          border: `1px solid ${populationStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {populationStatus.message}
        </div>
      )}
      
      <ul className="topics-list">
        {Object.values(topics).map((topic) => (
          <li className="topic" key={topic.id}>
          <Link to={ROUTES.topicRoute(topic.id)} className="topic-link">
           <div className="topic-container">
             <img src={topic.icon} alt="" />
             <div className="text-content">
               <h2>{topic.name}</h2>
               <p>{topic.quizIds.length} Quizzes</p>
             </div>
           </div>
         </Link>
          </li>
        ))}
      </ul>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handlePopulateQuizzes}
          disabled={isPopulating}
          className="button"
          style={{ 
            marginRight: '10px',
            backgroundColor: isPopulating ? '#6c757d' : '#28a745',
            borderColor: isPopulating ? '#6c757d' : '#28a745',
            color: 'white'
          }}
        >
          {isPopulating ? 'Creating Trivia Quizzes...' : 'Populate with Trivia Quizzes'}
        </button>
      </div>
      
      <Link
        to={ROUTES.newTopicRoute()}
        className="button create-new-topic-button"
      >
        Create New Topic
      </Link>
    </section>
  );
}