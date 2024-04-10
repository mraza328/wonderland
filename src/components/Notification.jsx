import React from "react";

const Notification = ({ message, type }) => {
  return (
    <div className={`alert alert-${type} mt-3 text-center`} role="alert">
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default Notification;
