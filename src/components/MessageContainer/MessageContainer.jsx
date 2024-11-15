import React, { useEffect, useRef, useState } from "react";
import "./MessageContainer.css";

const MessageContainer = ({ messageList, user, fetchMessages }) => {
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // 하단 여부 확인
    const isBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight;
    setIsAtBottom(isBottom);

    // 스크롤이 상단에 도달하면 이전 메시지 로드
    if (container.scrollTop === 0) {
      fetchMessages();
    }
  };

  // 메시지 추가 시 조건부 스크롤
  useEffect(() => {
    const container = containerRef.current;
    if (container && isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messageList, isAtBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="message-container"
    >
      {messageList.map((message, index) => {
        const isSystem = message.user.name === "system";
        const isMyMessage = message.user.name === user.name;
        const isVisible =
          index === 0 ||
          messageList[index - 1]?.user.name !== message.user.name;

        return (
          <div key={message._id || index} className="message-item">
            {isSystem ? (
              <div className="system-message">{message.chat}</div>
            ) : (
              <div className={isMyMessage ? "my-message" : "your-message"}>
                {!isMyMessage && isVisible && (
                  <img
                    src="/profile.jpeg"
                    alt="profile"
                    className="profile-image"
                  />
                )}
                <div>{message.chat}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
