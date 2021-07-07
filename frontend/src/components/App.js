import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { SWRConfig } from 'swr';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from './Loading';
import DashboardLayout from './DashboardLayout';
import State from './State';
import theme from '../theme';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';
import Landing from '../pages/index';
import ClimbingGradeConverter from '../pages/ClimbingGradeConverter';
import ErrorBoundary from './ErrorBoundary';
import Fathom from './Fathom';

const LogIn = lazy(() => import('../pages/LogIn'));
const Register = lazy(() => import('../pages/Register'));
const Jobs = lazy(() => import('../pages/Jobs'));
const Users = lazy(() => import('../pages/Users'));
const Ticks = lazy(() => import('../pages/Ticks'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

const AdminRoutes = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route
            path="/admin/jobs"
            exact
            rolesNeeded={['admin']}
            component={Jobs}
          />
          <Route
            path="/admin/users"
            exact
            rolesNeeded={['admin']}
            component={Users}
          />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <Suspense fallback={<Loading />}>
            <CSSReset />
            <State>
              <SWRConfig value={{ refreshInterval: 10000 }}>
                <Router>
                  <Fathom />
                  <Switch>
                    <Route path="/" exact component={Landing} />
                    <Route path="/login" exact component={LogIn} />
                    <Route path="/register" exact component={Register} />
                    <Route
                      path="/forgot-password"
                      exact
                      component={ForgotPassword}
                    />
                    <Route path="/reset" exact component={ResetPassword} />
                    <Route
                      path="/climbing-grade-converter"
                      component={ClimbingGradeConverter}
                      exact
                    />
                    <ProtectedRoute path="/app" component={Ticks} />
                    <ProtectedRoute
                      path="/admin"
                      rolesNeeded={['admin']}
                      component={AdminRoutes}
                    />
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

export default App;
