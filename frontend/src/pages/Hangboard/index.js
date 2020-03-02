import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import SequenceList from './SequenceList';
import SequenceCreate from './SequenceCreate';
import SequenceEdit from './SequenceEdit';

const Hangboard = ({ match }) => {
  return (
    <Switch>
      <Route path={match.path} exact component={SequenceList} />
      <Route
        path="/app/hangboard/sequence/new"
        exact
        component={SequenceCreate}
      />
      <Route
        path="/app/hangboard/sequence/:id/edit"
        exact
        component={SequenceEdit}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Hangboard;
