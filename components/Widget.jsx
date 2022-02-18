import Trending from "./Trending";
import Image from "next/image";
import Search from "./Search";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ReactLoading from "react-loading";

const Widget = ({ trendingResults, followResults }) => {
  const [followUsers, setFollowUsers] = useState([]);
  const [usersFriends, setUsersFriends] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [doneFollowProcess, setDoneFollowProcess] = useState(false);

  /**
   * Get all users that aren't followed by the current user
   */
  const getUsers = async () => {
    setLoading(true);
    const a = await getDocs(
      collection(db, "users", session?.user?.email, "followed")
    ).then((res) => res.docs.map((doc) => doc.data().id));

    const usersRef = await getDocs(
      query(
        collection(db, "users"),
        where("id", "not-in", [session?.user?.uid, ...a]),
        limit(5)
      )
    ).then((res) => setFollowUsers(res.docs.map((doc) => doc.data())));
    setLoading(false);
  };

  useEffect(() => getUsers(), [followUsers.length, doneFollowProcess]);

  const showLoading = loading && (
    <div className=" flex justify-center items-center ">
      <ReactLoading type="bubbles" color="#f5f5f5" />
    </div>
  );

  /**
   * It follows a user.
   * @param e - The event object.
   * @param user - The user that you want to follow.
   */
  const followUserHandler = async (e, user) => {
    const { email, id, name } = user;
    e.preventDefault();
    await setDoc(doc(db, "users", session?.user?.email, "followed", id), {
      id: id,
      email: email,
      name: name,
    });

    await setDoc(doc(db, "users", email, "followedBy", session?.user?.uid), {
      id: session?.user?.uid,
      email: session?.user?.email,
      name: session?.user?.name,
    });
    setDoneFollowProcess(true);
  };

  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <div className="sticky flex flex-col top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <Search />
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">What&apos;s happening?</h4>
        {showLoading}
        {trendingResults?.map((result, index) => (
          <Trending key={index} result={result} />
        ))}
        <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {showLoading}
        {followUsers?.map((result, index) => (
          <Link href={`/profile/${result.id}`} key={index}>
            <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center">
              <Image
                src={result.image}
                width={50}
                height={50}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
              <div className="ml-4 leading-5 group">
                <h4 className="font-bold group-hover:underline">
                  {result.name}
                </h4>
                <h5 className="text-gray-500 text-[15px]">@{result.tag}</h5>
              </div>
              <button
                className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5"
                onClick={(e) => followUserHandler(e, result)}
              >
                Follow
              </button>
            </div>
          </Link>
        ))}

        {followUsers.length === 0 && (
          <p className=" text-center p-3 text-lg ">No one to follow 😟</p>
        )}

        {/* {followUsers.length > 3 && (
          <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
            Show more
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Widget;
