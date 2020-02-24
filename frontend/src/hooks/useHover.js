import { useState } from 'react';

export default () => {
  const [hovered, set] = useState(false);
  const binder = {
    onMouseEnter: () => set(true),
    onMouseLeave: () => set(false),
  };
  return [hovered, binder];
};
