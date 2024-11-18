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
  const [hasMore, setHasMore] = useState(true); // 더 이상 메시지가 없을 경우

  // 메시지 로드 함수
  const fetchMessages = useCallback(async () => {
    if (isFetching || !hasMore) return; // 중복 호출 방지 및 hasMore 체크
    setIsFetching(true);

    try {
      const response = await fetch(`/api/rooms/${id}/messages?page=${page}`);
      const data = await response.json();
      if (data.ok) {
        if (data.messages.length === 0) {
          setHasMore(false); // 더 이상 메시지가 없으면 중단
        } else {
          setMessageList((prev) => [...data.messages, ...prev]); // 기존 메시지 위에 추가
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsFetching(false);
    }
  }, [id, page, isFetching, hasMore]);

  // 채팅방 조인
  useEffect(() => {
    socket.emit("joinRoom", id, (res) => {
      if (res.ok) {
        console.log("Joined room successfully");
      } else {
        console.error("Failed to join room", res.error);
      }
    });

    return () => {
      socket.emit("leaveRoom", id);
    };
  }, [id]);

  // 스크롤 이벤트로 메시지 로드
  useEffect(() => {
    const container = document.querySelector(".message-container");
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isFetching) {
        const prevScrollHeight = container.scrollHeight;
        fetchMessages().then(() => {
          container.scrollTop = container.scrollHeight - prevScrollHeight; // 스크롤 유지
        });
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [fetchMessages, isFetching, hasMore]);

  // 새 메시지 수신 처리
  useEffect(() => {
    const handleMessage = (res) => {
      setMessageList((prev) => [...prev, res]); // 새 메시지는 맨 아래에 추가
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, []);

  // 메시지 보내기
  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", message, (res) => {
      if (res.ok) {
        setMessage(""); // 입력 필드 초기화
      } else {
        console.error("Failed to send message", res.error);
      }
    });
  };

  // 방 나가기
  const leaveRoom = () => {
    socket.emit("leaveRoom", id, (res) => {
      if (res.ok) {
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
      <MessageContainer messageList={messageList} user={user} fetchMessages={fetchMessages} />
      <InputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatPage;
