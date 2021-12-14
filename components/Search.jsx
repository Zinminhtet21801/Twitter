import { SearchIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import UserProfileButton from "./UserProfileButton";

const users = [
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZEfdgssssssssssssssssssss",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
  {
    image: "https://rb.gy/ogau5a",
    name: "ZEZE",
    tag: "zjekjlk",
  },
];

const Search = () => {
  const [input, setInput] = useState();
  return (
    <>
      <div className="flex justify-between items-center bg-[#202327] p-3 rounded-full relative ">
        <SearchIcon className="text-gray-500 h-5 z-[60] " />
        <input
          type="text"
          className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 px-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
          placeholder="Search Twitter"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <div className="w-6 h-6 z-[60]">
          <XIcon
            className="p-1 rounded-full border-none text-gray-500   hover:text-white hover:bg-blue-400  "
            onClick={() => setInput("")}
          />
        </div>
      </div>
      {input && (
        <div className="grid grid-cols-1 divide-y divide-opacity-40 divide-gray-500 text-gray-300 ">
          {users.map((user,index) => (
            <div className="searchItem" key={index} >
              <UserProfileButton
                logout={false}
                avatar={user.image}
                name={user.name}
                tag={user.tag}
                hover={false}
                profile={false}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Search;
