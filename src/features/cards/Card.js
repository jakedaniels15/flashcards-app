import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCardById } from "./cardsSlice";

export default function Card({ id }) {
  const card = useSelector(state => selectCardById(state, id));
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRevealAnswer = (e) => {
    e.stopPropagation();
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setFlipped(true);
      setIsAnimating(false);
    }, 150);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setFlipped(false);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <li>
      <div className="card-container">
        <div className="card">
          <div className={`card-content ${isAnimating ? 'animating' : ''}`} key={flipped ? 'back' : 'front'}>
            {flipped ? (
              <div className="answer-content">
                <div className="answer-label">Answer:</div>
                <div className="answer-text">{card.back}</div>
              </div>
            ) : (
              <div className="question-content">
                <div className="question-text">{card.front}</div>
              </div>
            )}
          </div>
          <div className="card-actions">
            {!flipped ? (
              <button 
                className="reveal-answer-button"
                onClick={handleRevealAnswer}
                disabled={isAnimating}
              >
                <span>🔍</span> Reveal Answer
              </button>
            ) : (
              <button 
                className="reset-card-button"
                onClick={handleReset}
                disabled={isAnimating}
              >
                <span>🔄</span> Show Question Again
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
