import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import BetasheetsList from './BetasheetsList';
import BetasheetCreate from './BetasheetCreate';
import BetasheetEdit from './BetasheetEdit';
import BetasheetShow from './BetasheetShow';

const Betasheets = ({ match }) => {
  return (
    <Switch>
      <Route path={match.path} exact component={BetasheetsList} />
      <Route path="/app/betasheets/new" exact component={BetasheetCreate} />
      <Route path="/app/betasheets/:id/edit" exact component={BetasheetEdit} />
      <Route path="/app/betasheets/:id/edit" component={BetasheetShow} exact />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Betasheets;
