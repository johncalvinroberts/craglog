import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import Loading from '../../components/Loading';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardWrapper from '../../components/DashboardWrapper';
import TickCreate from './TickCreate';
import TickList from './TickList';

const Hangboard = lazy(() => import('../Hangboard'));

const Home = ({ match }) => {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <DashboardWrapper>
          <Route path={match.path} exact component={TickList} />
          <Route path={`${match.path}/tick/new`} exact component={TickCreate} />
          <Route path={`${match.path}/hangboard`} exact component={Hangboard} />
        </DashboardWrapper>
      </Suspense>
    </DashboardLayout>
  );
};

export default Home;
