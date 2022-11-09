import { ReactComponent as AlertIcon } from '../svg/icon-alert.svg';
import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import Notification from './Notification';
import api from '../api/api';

const NotificationsDropdown = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle className="bg-transparent border-0 caret-off position-relative text-primary header-btn hover-themed-btn">
        <div  
          onClick={async () => {
            const hasUnreadNotifications = user?.notifications.filter(n => !n.read).length !== 0;
            if (!hasUnreadNotifications) 
              return;
            const lastNotificationId = user?.notifications[user?.notifications.length - 1].id;
            api.put(`/users/notifications`, { offset: lastNotificationId });
            const notifications = user?.notifications.map(n => {
              if (!n.read)
                n.read = true;
              
              return n;
            });

            setUser({
              ...user,
              notifications
            });
          }}
        >
          <FontAwesomeIcon icon={solid('bell')} size="xl" />
        </div>
        {
          user?.notifications &&
          user?.notifications?.filter(n => !n.read).length !== 0 &&
          <span className="position-absolute badge bg-primary border border-light">
            {user?.notifications?.filter(n => !n.read).length}
          </span>
        }
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>Notificações</Dropdown.Header>
        {
          user?.notifications?.map((notification) => (
            <Dropdown.Item className="p-1" key={notification.id}>
              <Notification {...notification} />
            </Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;