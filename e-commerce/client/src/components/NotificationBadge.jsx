import React from "react";

const NotificationBadge = ({ count }) => {
  if (count <= 0) {
    return null;
  }
  return (
    <div className="absolute top-0 right-0 bg-dark-purple text-black dark:text-light-purple rounded-full h-6 w-6 flexr">
      {count}
    </div>
  );
};

export default NotificationBadge;
