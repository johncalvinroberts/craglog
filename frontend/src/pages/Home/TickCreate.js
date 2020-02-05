import React from 'react';
import TickForm from './TickForm';
import useTitle from '../../hooks/useTitle';

const defaultValues = {
  type: 'redpoint',
  style: 'sport',
  routeId: null,
  notes: '',
  tickDate: new Date().toISOString().substr(0, 16),
  physicalRating: null,
  gymName: '',
  location: '',
};

const LogCreate = () => {
  useTitle('Add Log');
  const onSubmit = async (values) => console.log('yooooyoyo', values);

  return <TickForm onSubmit={onSubmit} defaultValues={defaultValues} />;
};

export default LogCreate;
