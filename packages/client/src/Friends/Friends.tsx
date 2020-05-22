import React, { useState, useCallback, useEffect } from 'react';
import { useAppState, UserData } from '../AppState';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../graphql';
import { FriendsComponent } from './FriendsComponent';

export const Friends: React.FC = () => {
  const { loading, userFriends, addFriend, deleteFriend } = useAppState();
  const [usersList, setUsersList] = useState<UserData[]>([]);

  const [getUsers, { data: getUsersData, loading: getUsersLoading }] = useLazyQuery<{ getUsers: UserData[] }>(
    GET_USERS,
    {
      onError: err => {
        console.warn(err);
      },
    }
  );

  const handleGetUser = useCallback(
    (name: string) => {
      getUsers({ variables: { name } });
    },
    [getUsers]
  );

  const handleAddFriend = useCallback(
    (userId: string) => () => {
      addFriend(userId);
    },
    [addFriend]
  );

  const handleDeleteFriend = useCallback(
    (friendId: string) => () => {
      deleteFriend(friendId);
    },
    [deleteFriend]
  );

  useEffect(() => {
    if (!getUsersLoading && getUsersData?.getUsers) {
      setUsersList([...getUsersData.getUsers]);
    } else {
      setUsersList([]);
    }
  }, [getUsersData, getUsersLoading]);

  const usersAvailable = [
    ...usersList.filter(
      userListItem =>
        !userFriends.find(userFriend => {
          if (userFriend && userFriend.id && userListItem && userListItem.id) {
            return userFriend.id === userListItem.id;
          }
          return false;
        })
    ),
  ];

  return (
    <FriendsComponent
      usersAvailable={usersAvailable}
      userFriends={userFriends}
      getUsers={handleGetUser}
      onAddFriend={handleAddFriend}
      onDeleteFriend={handleDeleteFriend}
      loading={loading}
      getUsersLoading={getUsersLoading}
    />
  );
};
