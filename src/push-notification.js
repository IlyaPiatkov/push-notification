import React, { useCallback, useState } from "react";
import uniqueId from "lodash.uniqueid";

import { PushNotificationWithContext } from "./contexts";
import { PushNotificationContent } from "./push-notification-content";

export const PushNotification = ({ children }) => {
  const [notificationInstances, setNotificationInstances] = useState(
    Object.freeze({})
  );

  const createInstance = useCallback((options) => {
    const id = uniqueId("push-notification-");

    const onCloseAllNote = () => {
      setNotificationInstances((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          configs: []
        }
      }));
    };

    const onCloseNote = (noteId) => {
      setNotificationInstances((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          configs: prevState[id].configs.filter((note) => note.id !== noteId)
        }
      }));
    };

    const onShownNote = (configId) => {
      setNotificationInstances((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          configs: prevState[id].configs.map((config) => {
            if (configId === config.id || configId === null) {
              return { ...config, shown: false };
            }

            return config;
          })
        }
      }));
    };

    const removeInstance = () => {
      setNotificationInstances(({ [id]: del, ...rest }) => rest);
    };

    const onCreateNote = (note) => {
      setNotificationInstances((prevState) => {
        const isNotUniqueId = prevState[id].configs.some(
          (item) => item.id === note.id
        );

        if (isNotUniqueId) {
          return prevState;
        }

        return {
          ...prevState,
          [id]: {
            ...prevState[id],
            configs: [
              ...prevState[id].configs,
              { ...note, onCloseNote, onCloseAllNote, onShownNote, shown: true }
            ]
          }
        };
      });
    };

    setNotificationInstances((prevState) => ({
      ...prevState,
      [id]: { configs: [], ...options }
    }));

    return { onCreateNote, removeInstance };
  }, []);

  const content = Object.entries(notificationInstances).map(([id, options]) => {
    return <PushNotificationContent key={id} {...options} />;
  });

  return (
    <PushNotificationWithContext createInstance={createInstance}>
      {children}
      {content}
    </PushNotificationWithContext>
  );
};
