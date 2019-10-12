import React from 'react';
import useLayout from '@/hooks/useLayout';
import Dashboard from '@/layouts/Dashboard';

const Jobs = () => {
  useLayout(Dashboard);
  return <div>yo this is jobs</div>;
};

export default Jobs;
