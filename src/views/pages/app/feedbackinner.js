import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const FeedbackItem = ({ questionData, isSubscribed }) => {
  const {
    question,
    options,
    feedback,
    status,
    questionNo,
    selected_options = [],
    correct_options = []
  } = questionData;
  const [showExplanation, setShowExplanation] = useState(false);

  const handleToggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const getOptionStyle = (optionText) => {
    const isSelected = selected_options.includes(optionText);
    const isCorrect = correct_options.includes(optionText);

    if (isSelected && isCorrect) {
      return { color: 'green', icon: <FaCheck style={{ color: 'green', marginLeft: '5px' }} /> };
    } else if (isSelected && !isCorrect) {
      return { color: 'red', icon: <FaTimes style={{ color: 'red', marginLeft: '5px' }} /> };
    } else if (!isSelected && isCorrect) {
      return { color: 'black', icon: <FaCheck style={{ color: 'green', marginLeft: '5px' }} /> };
    } else {
      return { color: 'black', icon: null };
    }
  };

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <div className="text-default" style={{ fontWeight: 'bolder', marginBottom: '5px' }}>
        <span>{questionNo}.{question.text}</span>
      </div>

      <div style={{ color: status === "CORRECT !" ? 'green' : 'red', marginBottom: '10px' }}>
        {status}
      </div>

      <div style={{ marginLeft: '20px' }}>
        {options.map((option, index) => {
          const { color, icon } = getOptionStyle(option.text);
          return (
            <div key={index} style={{ color: color, display: 'flex', alignItems: 'center' }}>
              <span>{option.text}</span>
              {icon && icon}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '10px', marginLeft: '20px' }}>
        <div>
          <strong style={{ color: 'blue' }}>Selected Options:</strong>{' '}
          <span style={{ color: 'blue' }}>{selected_options.join(', ')}</span>
        </div>
        <div>
          <strong style={{ color: 'green' }}>Correct Options:</strong>{' '}
          <span style={{ color: 'green' }}>{correct_options.join(', ')}</span>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <div className="toggle-explanation text-default" onClick={handleToggleExplanation}>
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </div>
      </div>

      {showExplanation && feedback && (
        <div style={{ marginTop: '10px' }}>
          <strong>Explanation:</strong> {feedback}
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;
