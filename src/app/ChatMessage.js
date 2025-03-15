
import Image from "next/image";
import ai_profile from '../../public/ai-profile2.png'

export default function ChatMessage({chat}) {
    console.log(chat)
  return (
    <div className={`message ${chat.role === "model" ? 'bot flex items-center' : "user  items-end flex flex-col"} user-message `}>
        {chat.role === "model" ? (
          !chat.hideInChat && (// if hideInChat false then it is work
            <>
                <Image  src={ai_profile} alt="AI-image" className=" w-11 h-11 bg-violet-100 rounded-full p-1 me-2"/>
                <p className={`message-text ${chat.isError && "text-red-500"} max-w-[75%] break-words whitespace-pre-line bg-violet-100 rounded-t-xl rounded-br-xl px-2.5 py-2`}>{chat.text}</p>
            </>
          )
          )  : (
                <p className="message-text max-w-[75%] break-words whitespace-pre-line   rounded-t-xl rounded-bl-xl px-2.5 py-2 bg-violet-600 text-white">{chat.text}</p>
          )
        } 
        
    </div>
  )
}
