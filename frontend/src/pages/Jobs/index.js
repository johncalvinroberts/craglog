import React, { useState } from 'react';
import { Icon } from '@chakra-ui/core';
import DashboardWrapper from '../../components/DashboardWrapper';
import { useTitle } from '../../hooks';
import JobsCountData from './JobsCountData';
import JobsDataGrid from './JobsDataGrid';

const Jobs = () => {
  const [params, setParams] = useState({
    type: 'route',
    status: 'active',
  });

  useTitle(
    <>
      Admin <Icon name="chevron-right" /> Jobs
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
