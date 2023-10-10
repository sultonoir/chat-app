import { api } from "@/lib/api";
import React from "react";
import DetailsMember from "./DetailsMember";
import useProfileUser from "@/hooks/useProfileUser";

type Props = {
  userId: string;
  isChatBox?: boolean;
  memberId: string;
};

const DetailsFindMember = ({ memberId, userId, isChatBox }: Props) => {
  const { data } = api.group.findMember.useQuery({
    memberId,
  });
  const profileUser = useProfileUser();
  return (
    <>
      {isChatBox ? (
        <div className="mt-[-4px] flex min-h-[20px] overflow-x-hidden text-xs">
          <div className="max-w-xs grow truncate font-normal leading-5 dark:text-[#8696a0]">
            {data?.username}
          </div>
        </div>
      ) : (
        <DetailsMember
          imageUrl={data?.image ?? ""}
          name={data?.username ?? ""}
          etc={data?.email ?? ""}
          onClick={() => profileUser.onOpen({ user: data })}
        />
      )}
    </>
  );
};

export default DetailsFindMember;
