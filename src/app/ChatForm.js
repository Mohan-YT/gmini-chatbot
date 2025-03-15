'use client'
import React, { useRef } from 'react'
import { BsFillSendFill } from 'react-icons/bs'

export default function ChatForm({chatHistory,setChatHistory, generateResponse}) {

    const inputRef = useRef()

    const handleSubmit = (e)=>{
        e.preventDefault()
       const userMessage =  inputRef.current.value.trim()

        if(!userMessage) return ;
        inputRef.current.value = ""

        //set the input values to chat history with role : user
        setChatHistory((history) => [...history , {role : "user" , text : userMessage}])

        //set the bot response message with role : model === user
        setTimeout(()=>{
            setChatHistory((history) => [...history , {role : "model" , text : 'Loading...'}])

            // call the function to genarate the bot's response
            generateResponse([...chatHistory , {role : "user" , text :userMessage}])

            //this is chatbot only tell the querys of company info no response other questions
            // generateResponse([...chatHistory , {role : "user" , text :` using the details provided above please address this querys: ${userMessage}`}])
        },600)
    }


  return (
    <form action="#" className="chat-form flex items-center outline outline-violet-300 rounded-3xl focus-within:outline-2 " onSubmit={handleSubmit}>
    <input ref={inputRef} type="text" placeholder="Ask Anything..." className="message-input border-0 outline-0 h-11 w-[100%] py-4 px-3" />
    <button type='submit' className="form-btn  w-10 h-9 bg-violet-600 justify-center items-center rounded-full pe-1 m-1 shrink-1 cursor-pointer text-white transition-all duration-300 ease-out hover:bg-violet-300 hover:text-violet-500">
        <BsFillSendFill className="transform rotate-45 " />
    </button>
</form>
  )
}
