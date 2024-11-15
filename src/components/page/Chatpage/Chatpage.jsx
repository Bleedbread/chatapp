import React, { useEffect, useState } from 'react'
import {useParams,useNavigate} from "react-router-dom"
import socket from "../../../server";
import { Button } from "@mui/base/Button"
import MessageContainer from "../../../components/MessageContainer/MessageContainer";
import InputField from "../../../components/InputField/InputField";
import './chatPageStyle.css'


  

const ChatPage = ({user}) => {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const {id} = useParams() // URL에서 방 ID 가져오기
    const navigate = useNavigate()
    const [checkJoinedRoom, setCheckJoinedRoom] = useState(false)
    
    useEffect(()=> {
      if(!checkJoinedRoom)
      {
        socket.emit("joinRoom",id,(res)=>{
          if(res.ok){
              console.log("successfully join",res);
              setCheckJoinedRoom(true);
          }
          else{
              console.log("fail to join",res);
          }
        })
      }
    },[checkJoinedRoom,id])

    const leaveRoom = () => {
      console.log("Leave room button clicked"); // 함수 호출 확인
      socket.emit("leaveRoom", id, (res) => {
        if (res.ok) {
          console.log("Successfully left the room"); // 서버 응답 확인
          setMessageList([]);
          navigate("/"); // 다시 채팅방 리스트 페이지로 돌아감
        } else {
          console.error("Failed to leave the room", res.error);
        }
      });
    };

    useEffect(() => {
      const handleMessage = (res) =>
      {
        console.log("message", res);
        setMessageList((prevState) => prevState.concat(res));
      }
      socket.on("message",handleMessage);
      return () =>
      {
        socket.off("message", handleMessage);
      }

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
            <nav>
              <Button onClick={leaveRoom}className='back-button'>←</Button>
              <div className='nav-user'>{user.name}</div>
            </nav>
          <div>
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