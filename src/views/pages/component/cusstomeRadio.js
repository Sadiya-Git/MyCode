const RadioButton = ({ name, id, value, onChange, checked, text }) => {
  const getTextLength = () => {
    return text.length;
  };

  const getDynamicStyles = () => {
    const textLength = getTextLength();

    let dynamicStyles = {};

    if (textLength > 10) {
      dynamicStyles = {
        margin: '0 2px',  
      };
    }

    return dynamicStyles;
  };

  return (
    <div className="radio-flex">
      <div className="radio-container">
        <label htmlFor={id} className="radio-label">
          <input
            className="radio-input"
            type="radio"
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            checked={checked}
          />
          <span className="custom-radio" />
          
        </label>
        <div className="text-container" style={getDynamicStyles()}>
            {text}
          </div>
      </div>
    </div>
  );
};

export default RadioButton;
