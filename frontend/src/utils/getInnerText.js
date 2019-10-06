/**
|--------------------------------------------------
| @description getInnerText
| returns the inner text of any react component
|--------------------------------------------------
*/

const getInnerText = (jsx) => {
  if (jsx === null || typeof jsx === 'boolean' || typeof jsx === 'undefined') {
    return '';
  }

  // Numeric children.
  if (typeof jsx === 'number') {
    return jsx.toString();
  }

  // String literals.
  if (typeof jsx === 'string') {
    return jsx;
  }

  // Array of JSX.
  if (Array.isArray(jsx)) {
    return jsx.reduce((memo, current) => {
      return memo + getInnerText(current);
    }, '');
  }

  // Children prop.
  if (jsx.props && jsx.props.children) {
    return getInnerText(jsx.props.children);
  }

  // Default
  return '';
};

export default getInnerText;
