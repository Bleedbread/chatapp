import React, { useEffect, useState } from 'react'
import {useParams,useNavigate} from "react-router-dom"
import socket from "../../../server";
//import { Button } from "@mui/base/Button"
import MessageContainer from "../../../components/MessageContainer/MessageContainer";
import InputField from "../../../components/InputField/InputField";
import './chatPageStyle.css'


  

const ChatPage = ({user}) => {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const {id} = useParams() // 유저가 조인한 방의 아이디를 url에서 가져온다.
    const navigate = useNavigate()
    
    socket.emit("joinRoom",id,(res)=>{
      if(res && res.ok){
          console.log("successfully join",res)
      }
      else{
          console.log("fail to join",res)
      }
    })

    const leaveRoom=()=>{
      socket.emit("leaveRoom",user,(res)=>{
          if(res.ok) navigate("/") // 다시 채팅방 리스트 페이지로 돌아감
      })
    }

    useEffect(() => {
      socket.on("message", (res) => {
        console.log("message",res)
        setMessageList((prevState) => prevState.concat(res));
      });

    }, []);
  
    const sendMessage = (event) => {
      event.preventDefault();
      socket.emit("sendMessage", message, (res) => {
        if (!res.ok) {
          console.log("error message", res.error);
        }
        setMessage("");
      });
    };

    return (
      <div>
        <div className="App">
          <div>
          <nav>
              <button onClick={leaveRoom}className='back-button'>←</button>
              <div className='nav-user'>{user.name}</div>
            </nav>
            {messageList.length > 0 ? (
              <MessageContainer messageList={messageList} user={user} />
            ) : null}
          </div>
          <InputField
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    );
}

export default ChatPage