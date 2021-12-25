import { SearchIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import UserProfileButton from "./UserProfileButton";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { searchInputs } from "../atoms/modalAtom";

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
  const [input, setInput] = useRecoilState(searchInputs);
  const [loading, setLoading] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);

  const fetchUsers = async (name) => {
    setLoading(true);
    let users = [];
    const q = query(
      collection(db, "users"),
      where("lowerCaseName", "==", name)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setSearchUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    const timer =
      input.trim() && setTimeout(() => fetchUsers(input.toLowerCase()), 1000);
    return () => clearTimeout(timer);
  }, [input]);

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
        {input && (
          <div className="w-6 h-6 z-[60]">
            <XIcon
              className="p-1 rounded-full border-none text-gray-500   hover:text-white hover:bg-blue-400  "
              onClick={() => {
                setInput("");
                setSearchUsers([]);
              }}
            />
          </div>
        )}
      </div>
      <div>
        <div className="absolute w-full z-[70] ">
          {loading && (
            <div className="base ">
              <div className="App"></div>
              <div className="App1"></div>
              <div className="App2"></div>
              <div className="App3"></div>
              <div className="App4"></div>
            </div>
          )}
          {input && !loading && (
            <div className="grid grid-cols-1 divide-y divide-opacity-40 divide-gray-500 text-gray-300 ">
              {searchUsers.map((user, index) => (
                <Link href={`/profile/${user.id}`} key={index}>
                  <div className="searchItem">
                    <UserProfileButton
                      logout={false}
                      avatar={user.image}
                      name={user.name}
                      tag={user.tag}
                      hover={false}
                      profile={false}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
