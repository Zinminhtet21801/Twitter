import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db, storage, app } from "../firebase";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { editModalState } from "../atoms/modalAtom";

function Input({ isEdit, postId }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const { data: session } = useSession();
  const [iseditModalOpen, setIsEditModalOpen] = useRecoilState(editModalState);

  const getEditPost = async () => {
    const editPostSnapshot = await getDoc(doc(db, "posts", postId));
    if (editPostSnapshot.exists()) {
      const { text, image } = editPostSnapshot.data();
      setInput(text);
      setSelectedFile(image);
    } else {
      return false;
    }
  };

  useEffect(() => {
    isEdit && getEditPost();
  }, [isEdit]);

  const addEmoji = (event) => {
    let sym = event.unified.split("-");
    let codesArr = [];
    sym.forEach((e) => codesArr.push("0x" + e));
    let emoji = String.fromCodePoint(...codesArr);
    setInput(input + emoji);
  };

  const addImageToPost = (event) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);
    const oldPostData = postId && await getDoc(doc(db, "posts", postId));

    const postData = {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: isEdit ? oldPostData.data().timestamp : serverTimestamp(),
      email: session?.user?.email,
    };

    const docRef = isEdit
      ? await setDoc(doc(db, "posts", postId), postData)
      : await addDoc(collection(db, "posts"), postData);

    !isEdit &&
      (await setDoc(
        doc(
          db,
          "users",
          session.user.email,
          "posts",
          isEdit ? postId : docRef.id
        ),
        {
          postId: docRef.id,
          timestamp: serverTimestamp(),
        }
      ));

    if (selectedFile) {
      const imageRef = ref(
        storage,
        `posts/${isEdit ? postId : docRef.id}/image`
      );
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", isEdit ? postId : docRef.id), {
          image: downloadURL,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
    setIsEditModalOpen(false);
  };

  return (
    // <div className={` border-b bordr-gray-700 p-3 flex space-x-3 overflow-y-scroll `} >

    <div
      className={`    border-b border-gray-700 p-3 flex space-x-3 overflow-y-hidden ${
        loading && "opacity-60"
      } `}
    >
      <img
        src={session.user.image}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer "
      />
      <div className="w-full divide-y divide-gray-700 ">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"} `}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px] "
            placeholder="What's happening?"
            rows="2"
          />

          {selectedFile && (
            <div className="relative">
              <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer ">
                <XIcon
                  className="text-white h-5"
                  onClick={() => setSelectedFile(null)}
                />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain "
              />
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center justify-between pt-2.5 ">
            <div className=" flex items-center ">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0] " />
                <input
                  type="file"
                  accept="image/*"
                  onChange={addImageToPost}
                  ref={filePickerRef}
                  hidden
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  theme="dark"
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: "-40px",
                    maxWidth: "320px",
                    borderRadius: "20px",
                    zIndex: 200,
                  }}
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default "
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
