import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loading from '../../components/Loading';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardWrapper from '../../components/DashboardWrapper';
import NotFound from '../NotFound';
import TickList from './TickList';
import BetaSheets from '../BetaSheetGenerator';

const Hangboard = lazy(() => import('../Hangboard'));
const TickCreate = lazy(() => import('./TickCreate'));
const TickEdit = lazy(() => import('./TickEdit'));
const Account = lazy(() => import('../Account'));

const Home = ({ match }) => {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <DashboardWrapper>
          <Switch>
            <Route path={match.path} exact component={TickList} />
            <Route
              path={`${match.path}/tick/new`}
              exact
              component={TickCreate}
            />
            <Route
              path={`${match.path}/tick/:id/edit`}
              exact
              component={TickEdit}
            />
            <Route path={`${match.path}/hangboard`} component={Hangboard} />
            <Route path={`${match.path}/account`} component={Account} />
            <Route path={`${match.path}/betasheets`} component={BetaSheets} />
            <Route component={NotFound} />
          </Switch>
        </DashboardWrapper>
      </Suspense>
    </DashboardLayout>
  );
};

export default Home;
