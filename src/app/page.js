'use client'
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {Quicksand, Spicy_Rice } from "next/font/google";
import { FaArrowUp , FaArrowDown, FaChevronDown } from "react-icons/fa";

import ChatForm from "./ChatForm";
import ai from '../../public/ai.png'
import ai_profile from '../../public/ai-profile2.png'
import ChatMessage from "./ChatMessage";
// import { CompanyInfo } from "./CompanyInfo";

const quicksand = Quicksand({ weight: "600", subsets: ["latin"] });
const spicyRice = Spicy_Rice({ weight: "400", subsets: ["latin"] });

export default function Home() {
  
  const [chatHistory,setChatHistory] = useState([])

  // this is for company info
  // const [chatHistory,setChatHistory] = useState([
  //   {
  //     hideInChat : true,
  //     role : "model",
  //     text : CompanyInfo
  //   }
  // ])
  const chatBodyRef = useRef()

  const [isChatBox,setIsChatBox] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  const generateResponse = async (history)=>{

    const updateHistory = (text , isError = false)=>{
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Loading..."), {role : "model" , text , isError}])
    }

    //format the chat history : get the object values of role and text from history, and create format of { role, parts : [{text}] }
    const formatedHistory = history.map(({role,text}) => ({role, parts : [{text}]}))

    try {
      const API_URI = process.env.NEXT_PUBLIC_GEMINI_API
      const response = await fetch(API_URI , {
                      method : "POST",
                      headers : {"Content-Type" : "application/json"},
                      body : JSON.stringify({contents : formatedHistory})
                 }
      )

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong!");
        }

        const data = await response.json()

        console.log(data)
        const apiresponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        
        updateHistory(apiresponseText)

    }catch(error){
        updateHistory(error.message , true)
    }
  }
  
  useEffect(()=>{
      chatBodyRef.current.scrollTo({top : chatBodyRef.current.scrollHeight , behavior : "smooth"})
  },[chatHistory])

    // Detect screen size
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize); //for cleanUp
    }, []);

  return (
    <>
      <main className={` w-full h-screen ${quicksand.className} flex justify-center items-center transition-all 2s ease bg-violet-100 ${isMobile ? "relative" : ""} z-0`}>

        {/* AI - Image Section */}
    
        <motion.div className={`${isMobile ? "absolute z-5" : "relative"} flex flex-col justify-center items-center cursor-pointer `}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      opacity: isChatBox ? (isMobile ? 0 : 1) : 1,
                      scale: isChatBox ? (isMobile ? 0 : 1) : 1}}
                    transition={{ duration: 0.6, ease: "easeInOut" }}>

              <motion.div className="flex flex-col justify-center items-center cursor-pointer md:h-[85vh]"
                           onClick={()=> setIsChatBox((prev)=> !prev)}
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ duration: 0.5, ease: "easeInOut" }}>

                    <div className="flex flex-col justify-center items-center">
                        <h2 className={` text-violet-300 ${spicyRice.className}`}>I&#39;m a Chatbot</h2>
                        <FaArrowDown  className="arrow w-3 h-3 text-violet-200  " />
                    </div>

                  <Image  src={ai} alt="AI-image" priority className={`robot w-[19rem] md:w-[21rem] h-[90%]`}/>
                  <FaArrowUp  className="arrow w-10 h-10 text-violet-200  " />
              </motion.div>  
        </motion.div>


        {/* Main Container For Chat Box */}
        <div className="con-tainer">

              <motion.div className={` bg-violet-50  shadow-lg z-10 ${
                            isMobile ? "fixed w-full h-full top-0 left-0" : "relative  flex flex-col justify-center items-center w-[40vw] h-[90vh] rounded-2xl"
                          } ${isChatBox ? "flex " : "hidden"}  flex flex-col`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: isChatBox ? 1 : 0,
                            scale: isChatBox ? 1 : 0,
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}>

                    {/* Chatbot Header */}
                    <div className="chat-header h-[14%] md:w-[100%]  md:h-[15%] md:rounded-t-2xl flex justify-between items-center bg-violet-600 text-white px-4">
                        <div className="header-info flex justify-center items-center">
                              <div className="w-15 h-15 rounded-full bg-violet-100 flex justify-center items-center ">  
                                  <Image  src={ai_profile} alt="AI-image" className=" w-15 h-15 transition duration-300 ease-out cursor-pointer transform hover:scale-80"/>
                              </div>
                              <h2 className="logo-text text-2xl pl-4">G-Mini</h2>
                        </div>
                        <button onClick={()=> setIsChatBox((prev)=> !prev)} className="w-12 h-12 rounded-full flex justify-center items-center text-lg  transition-all duration-500 ease-out hover:bg-violet-200 hover:text-violet-700 cursor-pointer">
                            <FaChevronDown  />
                        </button>
                    </div>

                    {/* Chatbot Body */}
                    <div ref={chatBodyRef} className="chat-body pt-3 pb-5 flex flex-col w-[100%] gap-y-4 ps-3 pe-3 mb-[5rem] md:h-[75%] overflow-auto z-20 ">
                      <p className="text-center text-black">Welcome to Chatbot</p>
                        {chatHistory.map((chat,index)=>(
                          <ChatMessage key={index} chat={chat} />
                        ))}
                        

                    </div>

                    {/* Chatbot-Footer */}
                    <div className="chat-footer absolute bottom-0 left-0 w-[100%] md:h-[12%] px-3 py-4 md:mb-0.5 z-20">
                       <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateResponse={generateResponse} />
                    </div>

              </motion.div>
        </div>
      </main>
    </>
  );
}
