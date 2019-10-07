import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from './Loading';
import NotFound from '@/pages/NotFound';
import Layout from '@/layouts';
import State from './State';
import theme from '../theme';
import ProtectedRoute from './ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const LogIn = lazy(() => import('@/pages/LogIn'));
const Register = lazy(() => import('@/pages/Register'));

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Suspense fallback={<Loading />}>
          <CSSReset />
          <State>
            <Router>
              <Layout>
                <Switch>
                  <ProtectedRoute path="/" exact component={Home} />
                  <Route path="/login" exact component={LogIn} />
                  <Route path="/register" exact component={Register} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </Router>
          </State>
        </Suspense>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
