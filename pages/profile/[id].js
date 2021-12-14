import React, { useEffect, useState } from 'react'
import Head from "next/head";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/outline";
import { collection, doc, onSnapshot, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import { db } from '../../firebase.js'
import Widget from '../../components/Widget.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Post from '../../components/Post.jsx';

const profile = ({ trendingResults, followResults }) => {

    const { data: session } = useSession();
    const [ data, setData ] = useState([]);
    // const [ filteredData, setFilteredData ] = useState([]);
    const router = useRouter();

    useEffect(() => {
            
        // onSnapshot(collection(db, "users", session.user?.email, "posts"), (doc) => {
        //     setData(doc.docs);
        //     // doc.docs.map(postId => setData()
        // });

        const fetching = async () => {
            const q = query(
                collection(db, "posts"),
                where ("id", "==", session.user.uid),
            )
            
            const querySnapShot = await getDocs(q);
            const dataArray = [];
            querySnapShot.forEach(doc => dataArray.push(doc.data()))
            setData(dataArray.sort(function(x, y) {
                    return y.timestamp.seconds - x.timestamp.seconds
            }))
        }
        fetching();
    }, [])

    console.log(data)

    return (
        <div>
            <Head>
                <title>
                    {session?.user?.name} / Twitter
                </title>
                <link rel="icon" href="https://rb.gy/ogau5a" type="image/icon type"></link>
            </Head>
            <main className="bg-black min-h-screen max-w-[1500px] flex mx-auto">
                <Sidebar />
                <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px] ">
                    <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black ">
                        <div
                        className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 "
                        onClick={() => router.push("/")}
                        >
                            <ArrowLeftIcon className="text-white h-5 " />
                        </div>
                        Tweet
                    </div>
                    <div className='h-64 bg-[#2F3336] pt-40 pl-4'>
                        <img src={`${session?.user?.image}`} className='w-36 h-auto rounded-full border-2 border-black'/>
                    </div>
                    <div className='flex justify-end py-3 pr-5'>
                        <button className='border border-gray-300 rounded-full py-1 px-4 hover:bg-gray-500 hover:bg-opacity-50 transition ease-linear duration-200'>
                            <span className='font-semibold text-white'>Set up profile</span>
                        </button>
                    </div>
                    <div className='text-gray-300 text-opacity-60 pl-4 pt-4'>
                        <div><span className='text-xl font-bold text-white'>{session?.user?.name}</span></div>
                        <div className='pb-2'><span>@{session?.user?.tag}</span></div>
                        <div className='pb-2'>
                            <CalendarIcon className='inline pb-1 pr-1 h-5'/>Joined March 2021
                        </div>
                        <div className='flex'>
                            <div className='pr-4'><span className='text-white font-bold'>69</span> Following</div>
                            <div><span className='text-white font-semibold'>420</span> Followers</div>
                        </div>
                    </div>
                    <div className='flex justify-evenly pt-5 border-[#374151] border-b'>
                        <button className='px-[3.1rem] py-3 text-white hover:bg-gray-500 hover:opacity-40 transition ease-linear duration-150'><span className='font-semibold text-gray-300 text-opacity-60'>Tweets</span></button>
                        <button className='px-[3.1rem] py-3 text-white hover:bg-gray-500 hover:opacity-40 transition ease-linear duration-150'><span className='font-semibold text-gray-300 text-opacity-60'>Tweets & replies</span></button>
                        <button className='px-[3.1rem] py-3 text-white hover:bg-gray-500 hover:opacity-40 transition ease-linear duration-150'><span className='font-semibold text-gray-300 text-opacity-60'>Media</span></button>
                        <button className='px-[3.1rem] py-3 text-white hover:bg-gray-500 hover:opacity-40 transition ease-linear duration-150'><span className='font-semibold text-gray-300 text-opacity-60'>Likes</span></button>
                    </div>
                    <div className="flex border-l border-r border-gray-700 max-w-2xl pt-3">
                        <div className="pb-72 ">
                            {data.map((post) => (
                            <Post key={post.id} id={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                </div>
                <Widget
                trendingResults={trendingResults}
                followResults={followResults}
                />
            </main>
        </div>
    )
}

export default profile;

export async function getServerSideProps(context) {
    const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
      (res) => res.json()
    );
    const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
      (res) => res.json()
    );
    const session = await getSession(context);
    
    return {
      props: {
        trendingResults,
        followResults,
        session
      },
    };
  }