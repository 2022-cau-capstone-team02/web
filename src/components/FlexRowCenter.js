import React from 'react';

const FlexRowCenter = ({ children, moreStyle, ...restProps }) => {
  return (
    <div style={{ display : "flex", flexDirection : "row", alignItems : "center", ...moreStyle}} {...restProps}>
      { children }
    </div>
  );
};

export default FlexRowCenter;
