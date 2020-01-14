import React, { useState } from 'react';
import { Icon } from '@chakra-ui/core';
import useLayout from '../../hooks/useLayout';
import useTitle from '../../hooks/useTitle';
import Dashboard from '../../layouts/Dashboard';
import DashboardWrapper from '../../components/DashboardWrapper';
import JobsCountData from './JobsCountData';
import JobsDataGrid from './JobsDataGrid';

const Jobs = () => {
  const [params, setParams] = useState({
    type: 'route',
    status: 'active',
  });

  useLayout(Dashboard);
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Jobs
    </>,
  );

  const handleChangeParams = (update) => {
    setParams({ ...params, ...update });
  };

  return (
    <DashboardWrapper>
      <JobsCountData params={params} handleChangeParams={handleChangeParams} />
      <JobsDataGrid params={params} handleChangeParams={handleChangeParams} />
    </DashboardWrapper>
  );
};

export default Jobs;
