import React from 'react';
import { useTitle } from '@/hooks';

const Home = () => {
  useTitle('Hangboard');
  return <div>Hang thyme</div>;
};

export default Home;
