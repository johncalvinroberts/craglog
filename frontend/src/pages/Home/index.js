import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import Loading from '../../components/Loading';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardWrapper from '../../components/DashboardWrapper';
import TickCreate from './TickCreate';

const Hangboard = lazy(() => import('../Hangboard'));

const Log = () => {
  useTitle('Craglog');
  return <div>stuff fhere</div>;
};

const Home = ({ match }) => {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <DashboardWrapper>
          <Route path={match.path} exact component={Log} />
          <Route path={`${match.path}/tick/new`} exact component={TickCreate} />
          <Route path={`${match.path}/hangboard`} exact component={Hangboard} />
        </DashboardWrapper>
      </Suspense>
    </DashboardLayout>
  );
};

export default Home;
