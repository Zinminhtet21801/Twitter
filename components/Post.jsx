import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editModalState, modalState, postIdState } from "../atoms/modalAtom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  getDocs,
} from "@firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import Moment from "react-moment";
import toast, { Toaster } from "react-hot-toast";

function Post({ id, post, postPage, isHome }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [isEditModalOpen, setIsEditModalOpen] = useRecoilState(editModalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const [openEditTextModal, setOpenEditTextModal] = useState(false);

  const deletePost = async () => {
    deleteDoc(doc(db, "posts", id));
    deleteDoc(doc(db, "users", post.email, "posts", id));
    const postImageRef = ref(storage, `posts/${id}/image`);
    deleteObject(postImageRef)
      .then(() => console.log("SUFFERING FROM SUCCESS"))
      .catch((e) => console.log(e));

    const postCommentsSnapshot = await getDocs(
      collection(db, "posts", id, "comments")
    );
    postCommentsSnapshot.docs.map((f) => {
      const commentImageRef = ref(storage, `comments/${f.id}/image`);

      deleteObject(commentImageRef)
        .then(() => console.log("SUFFERING FROM SUCCESS"))
        .catch((e) => console.log(e));
    });

    !isHome && router.push("/");
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc"),
        (snapshot) => setComments(snapshot.docs)
      ),
    [id]
  );

  useEffect(
    () =>
      id &&
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [id]
  );

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [session?.user?.uid, likes]
  );

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div>
      <div className="p-3 z-10 flex cursor-pointer border-b border-gray-700 w-full ">
        {!postPage && (
          <img
            src={post?.userImg}
            alt="Profile Pic"
            className="h-11 w-11 rounded-full mr-3 "
            onClick={() => router.push(`/profile/${post.id}`)}
          />
        )}
        <div className="flex flex-col space-y-2 w-full ">
          <div className={`flex ${postPage && "justify-between"} `}>
            {postPage && (
              <img
                src={post?.userImg}
                alt="Profile Pic"
                className="h-11 w-11 rounded-full mr-3 "
                onClick={() => router.push(`/profile/${post.id}`)}
              />
            )}
            <div className=" text-[#6e767d] ">
              <div className="inline-block group">
                <h4
                  className={`font-bold text-[12px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                    !postPage && "inline-block"
                  } `}
                  onClick={() => router.push(`/profile/${post.id}`)}
                >
                  {post?.username}
                </h4>
                <span
                  className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"} `}
                  onClick={() => router.push(`/profile/${post.id}`)}
                >
                  @{post?.tag}
                </span>
              </div>{" "}
              .{" "}
              <span className="hover:underline text-sm sm:text-[15px] ">
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
              {!postPage && (
                <p
                  className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 "
                  onClick={() => router.push(`/${id}`)}
                >
                  {post?.text}
                </p>
              )}
            </div>

            {/* TODO */}
            <div
              className=" icon group flex-shrink-0 ml-auto "
              onClick={() => {
                setOpenEditTextModal(!openEditTextModal);
              }}
            >
              <div className={` relative `}>
                <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0] " />
                {openEditTextModal && (
                  <button
                    className={` text-white absolute top-7 right-0 rounded-md bg-gray-400 w-[50px] `}
                    onClick={() => {
                      setOpenEditTextModal(false);
                      setIsEditModalOpen(true);
                      setPostId(id);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
          {postPage && (
            <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 ">
              {post?.text}
            </p>
          )}
          <img
            src={post?.image}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2 "
            onClick={() => router.push(`/${id}`)}
          />
          <div
            className={`text-[#6e767d] flex justify-between w-10/12 ${
              postPage && "mx-auto"
            } `}
          >
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                setPostId(id);
                setIsOpen(true);
              }}
            >
              <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
              </div>
              {comments.length > 0 && (
                <span className="group-hover:text-[#1d9bf0] text-sm">
                  {comments.length}
                </span>
              )}
            </div>
            {session?.user?.uid === post?.id ? (
              <div
                className="flex items-center space-x-1 group"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePost()
                    .then((res) =>
                      toast.success("POST DELETION SUCCESS", {
                        style: {
                          fontWeight: 600,
                          background: "#333",
                          color: "#fff",
                          borderRadius: "10px",
                        },
                      })
                    )
                    .catch((e) =>
                      toast.error("POST DELETION FAIL", {
                        style: {
                          fontWeight: 600,
                          background: "#333",
                          color: "#fff",
                          borderRadius: "10px",
                        },
                      })
                    );
                }}
              >
                <div className="icon group-hover:bg-red-600/10">
                  <TrashIcon className="h-5 group-hover:text-red-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1 group">
                <div className="icon group-hover:bg-green-500/10">
                  <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                </div>
              </div>
            )}

            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className="icon group-hover:bg-pink-600/10">
                {liked ? (
                  <HeartIconFilled className="h-5 text-pink-600" />
                ) : (
                  <HeartIcon className="h-5 group-hover:text-pink-600" />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>

            <div className="icon group">
              <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            <div className="icon group">
              <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
