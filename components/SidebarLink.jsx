import { useRouter } from "next/router";

function SidebarLink({ Icon, text, active, userId }) {

  const router = useRouter();

  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
        active && "font-bold"
      } `}
      onClick={() => router.push(`/${text.toLowerCase()}/${userId && userId}`)}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
}

export default SidebarLink;
