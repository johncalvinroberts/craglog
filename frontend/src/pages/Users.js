import React from 'react';
import useSWR, { useSWRPages } from 'swr';
import { Icon } from '@chakra-ui/core';
import DashboardWrapper from '../components/DashboardWrapper';
import useTitle from '../hooks/useTitle';
import http from '../http';

const Users = () => {
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Users
    </>,
  );
  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'demo-page-2',
    /* eslint-disable react-hooks/rules-of-hooks */
    // page component
    ({ offset, withSWR }) => {
      const { data: users } = withSWR(
        // use the wrapper to wrap the *pagination API SWR*
        useSWR(`/users?skip=${offset || 0}&limit=25`, http.get),
      );
      /* eslint-enable react-hooks/rules-of-hooks */
      // you can still use other SWRs outside

      if (!users) {
        return <p>loading</p>;
      }

      return users.map((user) => <p key={user._id}>{user.email}</p>);
    },

    // get next page's offset from the index of current page
    (SWR, index) => {
      // there's no next page
      if (SWR.data && SWR.data.length === 0) return null;

      // offset = pageCount × pageSize
      return (index + 1) * 3;
    },

    // deps of the page component
    [],
  );

  const {
    data: { count },
  } = useSWR('/users/count', http.get);

  return (
    <DashboardWrapper>
      {pages}
      <button onClick={loadMore} disabled={isReachingEnd || isLoadingMore}>
        {/* eslint-disable no-nested-ternary */}
        {isLoadingMore ? '. . .' : isReachingEnd ? 'no more data' : 'load more'}
        {/* eslint-enable no-nested-ternary */}
      </button>
      <p>count: {count}</p>
    </DashboardWrapper>
  );
};

export default Users;
