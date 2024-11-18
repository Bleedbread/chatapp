import React, { useRef, useEffect } from "react";
import "./MessageContainer.css";

const MessageContainer = ({ messageList, user, fetchMessages }) => {
  const containerRef = useRef(null);

  // 스크롤 유지 및 이전 메시지 로드 처리
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; // 새 메시지 시 자동 스크롤
    }
  }, [messageList]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0) {
      fetchMessages(); // 상단에 도달하면 이전 메시지 로드
    }
  };

  return (
    <div
      ref={containerRef}
      className="message-container"
      onScroll={handleScroll}
    >
      {messageList.map((message, index) => {
        const isSystem = message.user.name === "system";
        const isMyMessage = message.user.name === user.name;

        return (
          <div key={index} className="message-item">
            {isSystem ? (
              <div className="system-message">{message.chat}</div>
            ) : isMyMessage ? (
              <div className="my-message">{message.chat}</div>
            ) : (
              <div className="your-message">
                <img
                  src="/profile.jpeg"
                  alt="profile"
                  className="profile-image"
                />
                {message.chat}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
