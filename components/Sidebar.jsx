import Image from "next/image";
import SidebarLink from "./SidebarLink";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserProfileButton from "./UserProfileButton";

function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter()
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image
          src="https://rb.gy/ogau5a"
          width={30}
          height={30}
          onClick={() => router.push("/")}
        />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24 ">
        <SidebarLink text="Home" Icon={HomeIcon} active />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} userId={session?.user?.uid} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="text-lg hidden xl:inline ml-auto bg-[#1d9bf0] rounded-full w-56 h-[52px] font-bold shadow-md hover:bg-[#1a8cd8] ">
        Tweet
      </button>
      <UserProfileButton hover profile logout={true} avatar={session?.user?.image} name={session?.user?.name} tag={session?.user?.tag} />
    </div>
  );
}

export default Sidebar;