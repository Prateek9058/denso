import React from "react";
import styled, { keyframes } from "styled-components";

const notifications = [
  { id: 1, text: "Trolley name 1 entered the geofence." },
  { id: 2, text: "Trolley name 2 entered the geofence." },
  { id: 3, text: "Aman Singh unloaded the trolley." },
];

const Marquee = () => {
  return (
    <MarqueeContainer>
      <ScrollWrapper>
        {notifications.concat(notifications).map((notification, index) => (
          <Notification key={index}>
            <NotificationContent>
              <NotificationIcon>🚚</NotificationIcon>
              <NotificationText>{notification.text}</NotificationText>
              <ViewIcon>👁</ViewIcon>
              <DeleteIcon>🗑</DeleteIcon>
            </NotificationContent>
          </Notification>
        ))}
      </ScrollWrapper>
    </MarqueeContainer>
  );
};
const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-90%);
  }
`;

const MarqueeContainer = styled.div`
  width: 100%;
//   overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  margin-top: 10px;
`;

const ScrollWrapper = styled.div`
  display: flex;
  animation: ${scroll} 30s linear infinite;
//   width: max-content;
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  margin: 0 15px;
  min-width: 300px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const NotificationIcon = styled.div`
  background-color: #d43f3f;
  color: white;
  padding: 10px;
  border-radius: 50%;
`;

const NotificationText = styled.div`
  margin: 0 15px;
  font-size: 14px;
  color: #333;
`;

const ViewIcon = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const DeleteIcon = styled.div`
  cursor: pointer;
`;

export default Marquee;
