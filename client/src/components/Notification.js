import styled from "styled-components";

const Notification = ({ title, content }) => {
  return (
    <div className="border-start border-5 border-primary ps-2">
      <h6>{title}</h6>
      <p className="m-0" style={{width: '300px', lineHeight: 1.15, whiteSpace: 'normal' }}>
        <small>{content}</small>
      </p>
    </div>
  );
};

export default Notification;