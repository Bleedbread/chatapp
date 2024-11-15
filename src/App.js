import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../../server";
import MessageContainer from "../../../components/MessageContainer/MessageContainer";
import InputField from "../../../components/InputField/InputField";
import "./chatPageStyle.css";

const ChatPage = ({ user }) => {
  const { id } = useParams(); // 방 ID
  const navigate = useNavigate();

  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [checkJoinedRoom, setCheckJoinedRoom] = useState(false);

  // 메시지 로드 함수
  const fetchMessages = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const response = await fetch(`/api/rooms/${id}/messages?page=${page}`);
      const data = await response.json();
      if (data.ok) {
        setMessageList((prev) => [...data.messages, ...prev]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }

    setIsFetching(false);
  }, [id, page, isFetching]);

  // 채팅방 조인
  useEffect(() => {
    if (checkJoinedRoom) return;

    socket.emit("joinRoom", id, (res) => {
      if (res.ok) {
        setCheckJoinedRoom(true);
      } else {
        console.error("Failed to join room", res.error);
      }
    });
  }, [checkJoinedRoom, id]);

  // 스크롤 이벤트로 메시지 로드
  useEffect(() => {
    const container = document.querySelector(".message-container");
    const handleScroll = () => {
      if (container.scrollTop === 0 && !isFetching) fetchMessages();
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [fetchMessages, isFetching]);

  // 새 메시지 수신 처리
  useEffect(() => {
    const handleMessage = (res) => setMessageList((prev) => [...prev, res]);

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, []);

  // 메시지 보내기
  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", message, (res) => {
      if (!res.ok) console.error("Failed to send message", res.error);
      setMessage("");
    });
  };

  // 방 나가기
  const leaveRoom = () => {
    socket.emit("leaveRoom", id, (res) => {
      if (res.ok) {
        setMessageList([]);
        navigate("/");
      } else {
        console.error("Failed to leave room", res.error);
      }
    });
  };

  return (
    <div className="App">
      <nav>
        <button onClick={leaveRoom} className="back-button">
          ←
        </button>
        <div className="nav-user">{user.name}</div>
      </nav>
      <MessageContainer messageList={messageList} user={user} />
      <InputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatPage;
