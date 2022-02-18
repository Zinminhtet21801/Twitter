import { useRecoilState } from "recoil";
import { editModalState, modalState, postIdState } from "../atoms/modalAtom";
import { useEffect, useState, useRef } from "react";
import {
  onSnapshot,
  doc,
} from "@firebase/firestore";
import { db } from "../firebase";
import {
  XIcon,
} from "@heroicons/react/outline";
import "emoji-mart/css/emoji-mart.css";

import Input from "./Input";

const EditPostModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(editModalState);
  const imgRef = useRef();
  const [showEmojis, setShowEmojis] = useState(false);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const [imageComment, setImageComment] = useState("");


  useEffect(
    () =>
      postId &&
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  return (
    //TODO EDIT MODAL
    isOpen && (
      <div className="fixed w-screen h-screen z-[55] ">
        <div
          className=" fixed h-screen bg-[#5b7083] bg-opacity-40 transition-opacity z-[55] top-0 left-0 right-0 "
          onClick={() => setIsOpen(false)}
        ></div>
        <div className="  flex justify-center xl:mr-[500px] ">
          <div className=" absolute  z-[101] mx-auto  bg-black rounded-t-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full xs:w-11/12 ">
            <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
              <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
                <XIcon
                  className="h-[22px] text-white"
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </div>

            {/* <Input isEdit postId={postId} /> */}
          </div>
          <div className="absolute z-[120] top-[53px]  bg-black rounded-b-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full xs:w-11/12 ">
            <Input isEdit postId={postId} />
          </div>
        </div>
      </div>
    )
  );
};
export default EditPostModal;
