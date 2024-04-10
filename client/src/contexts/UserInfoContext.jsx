import { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getAllGroups, getGroupsByUserId } from "../data/groups";

export const UserInfoContext = createContext({});

export default function UserInfoProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userGroupIds, setUserGroupIds] = useState([]);
  const { userId, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    getUsersGroups();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (userGroupIds.length > 0) {
      getGroups();
    }
  }, [userGroupIds]);

  const getGroups = async () => {
    try {
      const allGroups = await getAllGroups();
      const acceptedUserGroups = userGroupIds
        .filter((group) => group.accepted)
        .map((group) => group.group_id);
      const userMemberGroups = allGroups.filter((group) =>
        acceptedUserGroups.includes(group.group_id),
      );
      setUserGroups(userMemberGroups);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersGroups = async () => {
    if (!isLoggedIn) return;
    try {
      const usersGroups = await getGroupsByUserId(userId);
      console.log("getUserGroups:", usersGroups);
      setUserGroupIds(usersGroups);
      console.log("Users groups fetched. Found", usersGroups.length, "groups.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserInfoContext.Provider
      value={{ favorites, setFavorites, userGroups, setUserGroups, userGroupIds, setUserGroupIds}}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
