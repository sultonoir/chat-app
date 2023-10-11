import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  CheckboxGroup,
} from "@nextui-org/react";
import { MdGroupAdd } from "react-icons/md";
import { Friend } from "@prisma/client";
import { CustomCheckbox } from "./CustomCheckbox";
import { api } from "@/lib/api";

interface Props {
  friends: Friend[];
  groupId: string;
}

export default function AddMember({ friends, groupId }: Props) {
  const [groupSelected, setGroupSelected] = useState<string[]>([]);

  const handleGroupSelection = (
    newValue: string[] | React.FormEvent<HTMLDivElement>
  ) => {
    if (Array.isArray(newValue)) {
      setGroupSelected(newValue);
    }
  };

  const { mutate, isLoading } = api.group.addMember.useMutation();

  const handleSubmit = () => {
    const data = groupSelected.map((item) => ({
      groupId,
      memberId: item,
    }));
    mutate(data);
  };
  return (
    <Popover
      placement="bottom"
      showArrow={true}
      classNames={{
        base: "bg-bs",
        arrow: "bg-default-200",
      }}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="text-iconnav"
        >
          <MdGroupAdd size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex w-full flex-col gap-1">
          <CheckboxGroup
            label="add member"
            value={groupSelected}
            onChange={handleGroupSelection}
            classNames={{
              base: "w-full",
            }}
          >
            {friends.map((item) => (
              <CustomCheckbox
                key={item.id}
                userId={item.friendId}
                value={item.friendId}
                groupId={groupId}
              />
            ))}
          </CheckboxGroup>
        </div>
        <Button
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading}
          variant="solid"
          color="primary"
          size="sm"
          className="my-2 w-full"
        >
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
}
