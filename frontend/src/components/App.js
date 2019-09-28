import React, { Suspense, lazy } from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import theme from '../theme';
import Loading from './Loading';
import NotFound from './NotFound';
import UIProvider from '../context/UI';
import Layout from '../layouts';

const Home = lazy(() => import('./Home'));
const LogIn = lazy(() => import('./LogIn'));
const Register = lazy(() => import('./Register'));

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <Suspense fallback={<Loading />}>
          <CSSReset />
          <Router>
            <UIProvider>
              <Layout>
                <Switch>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route path="/log-in" exact>
                    <LogIn />
                  </Route>
                  <Route path="/register" exact>
                    <Register />
                  </Route>
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </UIProvider>
          </Router>
        </Suspense>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
