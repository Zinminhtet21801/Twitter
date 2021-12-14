import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { signOut } from "next-auth/react";
const UserProfileButton = ({ logout = false, avatar, name, tag, hover, profile }) => {
  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center ${hover && "hoverAnimation"} ${profile && "xl:ml-auto" } xl:-mr-5 mt-auto`}
      onClick={()=> logout ? signOut() : null}
    >
      <img src={avatar} alt="" className="h-10 w-10 rounded-full xl:mr-2.5" />
      <div className={`${profile && "hidden"} xl:inline leading-5`}>
        <h4 className="font-bold">{name}</h4>
        <p className="text-[#6e767d]">@{tag}</p>
      </div>
      {profile && <DotsHorizontalIcon className="h-5 hidden xl:inline pl-10 " />}
    </div>
  );
};

export default UserProfileButton;
