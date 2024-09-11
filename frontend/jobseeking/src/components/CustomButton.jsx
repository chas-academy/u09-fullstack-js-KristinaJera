// import React from "react";
import PropTypes from "prop-types";

const CustomButton = ({ title, containerStyles, iconRight, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`inline-flex items-center ${containerStyles}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

// Adding PropTypes validation
CustomButton.propTypes = {
  title: PropTypes.string.isRequired,  // 'title' is required and should be a string
  containerStyles: PropTypes.string,   // 'containerStyles' should be a string
  iconRight: PropTypes.node,           // 'iconRight' should be a React node (can be JSX or a component)
  type: PropTypes.string,              // 'type' should be a string, optional
  onClick: PropTypes.func,             // 'onClick' should be a function, optional
};

export default CustomButton;
