import { SparklesIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "./Input";
import {
  onSnapshot,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { useRecoilState } from "recoil";
import { editModalState } from "../atoms/modalAtom";
import EditPostModal from "./EditPostModal";
import { useRouter } from "next/router";


function Feed({ isProfile, isHome }) {
  const [isEditModalOpen, setIsEditModalOpen] = useRecoilState(editModalState);
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const [friendsList, setFriendsList] = useState([]);
  const [friendsIds, setFriendsIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const getUserFriendsList = async () => {
    setLoading(true);
    const userFriendsSnapshot = await getDocs(
      collection(db, "users", session?.user?.email, "followed")
    );
    let ids = [];
    userFriendsSnapshot.forEach((doc) => {
      setFriendsList(doc.data());
      ids.push(doc.data().id);
    });
    setFriendsIds(ids);
    setLoading(false);
  };

  const getPosts = async () => {
    setLoading(true);

    const isProfileQuery = isProfile
      ? [router.query.id]
      : [session?.user?.uid, ...friendsIds]
    let postsTemp = [];
    onSnapshot(query(collection(db, "posts"), where("id", "in", isProfileQuery)), (snapshot) =>
      setPosts(
        snapshot.docs.sort(function (x, y) {
          return y?.data()?.timestamp?.seconds - x?.data()?.timestamp?.seconds;
        })
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    getUserFriendsList();
    getPosts();
  }, [friendsIds.length, posts.length, router.query.id]);

  return (
    <>
      {isEditModalOpen && <EditPostModal />}
      <div
        className={`flex-grow  border-gray-700 ${
          !isProfile
            ? "border-l border-r max-w-2xl sm:ml-[73px] xl:ml-[370px]"
            : "w-full"
        }`}
      >
        {!isProfile && (
          <>
            <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black  border-b border-gray-700 ">
              <h2 className="text-lg sm:text-xl font-bold">HOME</h2>
              <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
                <SparklesIcon className="h-5 text-white" />
              </div>
            </div>

            <Input />
          </>
        )}

        <div className="pb-72 w-full flex-col ">
          {posts.map((post) => (
            <Post key={post.id} id={post.id} post={post.data()} isHome />
          ))}
        </div>
      </div>
    </>
  );
}

export default Feed;
