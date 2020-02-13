import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTitle } from '@/hooks';
import NotFound from '@/pages/NotFound';
import SequenceList from './SequenceList';
import SequenceCreate from './SequenceCreate';

const Hangboard = ({ match }) => {
  useTitle('Hangboard');
  return (
    <Switch>
      <Route path={match.path} exact component={SequenceList} />
      <Route
        path="/app/hangboard/sequence/new"
        exact
        component={SequenceCreate}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Hangboard;
