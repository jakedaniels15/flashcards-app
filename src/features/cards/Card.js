import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCardById } from "./cardsSlice";

export default function Card({ id }) {
  const card = useSelector(state => selectCardById(state, id));
  const [flipped, setFlipped] = useState(false);

  const handleRevealAnswer = (e) => {
    e.stopPropagation();
    setFlipped(true);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setFlipped(false);
  };

  return (
    <li>
      <div className="card-container">
        <div className="card">
          <div className="card-content">
            {flipped ? card.back : card.front}
          </div>
          <div className="card-actions">
            {!flipped ? (
              <button 
                className="reveal-answer-button"
                onClick={handleRevealAnswer}
              >
                Reveal Answer
              </button>
            ) : (
              <button 
                className="reset-card-button"
                onClick={handleReset}
              >
                Show Question Again
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
