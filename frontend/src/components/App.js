import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { SWRConfig } from 'swr';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from './Loading';
import { DashboardLayout } from '../layouts';
import State from './State';
import theme from '../theme';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';
import ErrorBoundary from './ErrorBoundary';

const LogIn = lazy(() => import('../pages/LogIn'));
const Register = lazy(() => import('../pages/Register'));
const Jobs = lazy(() => import('../pages/Jobs'));
const Users = lazy(() => import('../pages/Users'));
const Routes = lazy(() => import('../pages/Routes'));
const Home = lazy(() => import('../pages/Home'));
const Hangboard = lazy(() => import('../pages/Hangboard'));

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Switch>
        <ProtectedRoute path="/app" exact component={Home} />
        <ProtectedRoute path="/app/hangboard" exact component={Hangboard} />
        <ProtectedRoute
          path="/app/admin/jobs"
          exact
          rolesNeeded={['admin']}
          component={Jobs}
        />
        <ProtectedRoute
          path="/app/admin/users"
          exact
          rolesNeeded={['admin']}
          component={Users}
        />
        <ProtectedRoute
          path="/app/admin/routes"
          exact
          rolesNeeded={['admin']}
          component={Routes}
        />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
};

export default () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <Suspense fallback={<Loading />}>
            <CSSReset />
            <State>
              <SWRConfig value={{ refreshInterval: 10000 }}>
                <Router>
                  <Switch>
                    <Route path="/" exact component={Landing} />
                    <Route path="/login" exact component={LogIn} />
                    <Route path="/register" exact component={Register} />
                    <DashboardRoutes path="/app" />
                    <Route component={NotFound} />
                  </Switch>
                </Router>
              </SWRConfig>
            </State>
          </Suspense>
        </ColorModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
