import { useEffect, useState } from "react";
import { Button, Menu } from "@mantine/core";
import useUserInfo from "../../hooks/useUserInfo";
import useAuth from "../../hooks/useAuth";
import { basicNotification } from "../../components/Notifications";
import { getGroupMedia, addMediaToGroup } from "../../data/groupContent";
import { IconChevronDown } from "@tabler/icons-react";

export default function AddMediaToGroup({ mediaObj }) {
  const { userGroups } = useUserInfo();
  const { userId } = useAuth();
  const messageUser = basicNotification();
  const [groupsToAdd, setGroupsToAdd] = useState([]);
  const [groupsAdded, setGroupsAdded] = useState([]);

  useEffect(() => {
    const checkMediaInGroups = async () => {
      const groupsToAddTemp = [];
      const groupsAddedTemp = [];

      for (let group of userGroups) {
        const groupMedia = await getGroupMedia(group.group_id);
        const isAddedAlready = groupMedia.some((media) => media.tmdb_id === mediaObj.id);

        if (isAddedAlready) {
          groupsAddedTemp.push(group);
        } else {
          groupsToAddTemp.push(group);
        }
      }

      setGroupsToAdd(groupsToAddTemp);
      setGroupsAdded(groupsAddedTemp);
    };

    checkMediaInGroups();
  }, [userGroups, mediaObj.id]);

  const handleAddMedia = async (groupId) => {
    try {
      await addMediaToGroup(
        groupId,
        userId,
        mediaObj.title || mediaObj.name,
        mediaObj.title ? "movie" : "series",
        mediaObj.overview,
        mediaObj.id,
        mediaObj.poster_path,
      );
      messageUser("Media added to group", "Success", "green");

      const updatedGroup = userGroups.find((group) => group.group_id === groupId);
      setGroupsToAdd(groupsToAdd.filter((group) => group.group_id !== groupId));
      setGroupsAdded([...groupsAdded, updatedGroup]);
    } catch (error) {
      console.error(error);
      messageUser("Failed to add media", "Error", "red");
    }
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button
          color="blue"
          mb="xs"
          radius="md"
          variant="outline"
          rightSection={<IconChevronDown size={16} />}
        >
          Add to group
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {groupsToAdd.map((group) => (
          <Menu.Item key={group.group_id} onClick={() => handleAddMedia(group.group_id)}>
            {group.group_name}
          </Menu.Item>
        ))}
        {groupsAdded.map((group) => (
          <Menu.Item key={group.group_id} disabled>
            {group.group_name} (Already Added)
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}