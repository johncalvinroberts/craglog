import React from 'react';
import TickForm from './TickForm';
import useTitle from '../../hooks/useTitle';
import useGeoLocation from '../../hooks/useGeoLocation';

const getCoordsFromUserPosition = (position) => {
  if (!position) return null;
  return [position.coords.latitude, position.coords.longitude];
};

const defaultValues = {
  type: 'redpoint',
  style: 'sport',
  routeId: null,
  notes: '',
  tickDate: new Date(),
  physicalRating: null,
  gymName: '',
  location: '',
};

const LogCreate = () => {
  useTitle('Add Log');
  const onSubmit = async (values) => console.log('yooooyoyo', values);
  const [position, error] = useGeoLocation();
  const center = getCoordsFromUserPosition(position);
  console.log({ position, error });
  return (
    <TickForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      mapDefaultCenter={center}
    />
  );
};

export default LogCreate;
