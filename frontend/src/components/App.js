import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { SWRConfig } from 'swr';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from './Loading';
import Layout from '../layouts';
import State from './State';
import theme from '../theme';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';

const Home = lazy(() => import('../pages/Home'));
const LogIn = lazy(() => import('../pages/LogIn'));
const Register = lazy(() => import('../pages/Register'));
const Jobs = lazy(() => import('../pages/Jobs'));
const Users = lazy(() => import('../pages/Users'));

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Suspense fallback={<Loading />}>
          <CSSReset />
          <State>
            <SWRConfig value={{ refreshInterval: 3000 }}>
              <Router>
                <Layout>
                  <Switch>
                    <Route path="/" exact component={Landing} />
                    <Route path="/login" exact component={LogIn} />
                    <Route path="/register" exact component={Register} />
                    <ProtectedRoute path="/app" exact component={Home} />
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
                    <Route component={NotFound} />
                  </Switch>
                </Layout>
              </Router>
            </SWRConfig>
          </State>
        </Suspense>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
