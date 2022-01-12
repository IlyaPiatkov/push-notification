import React, { useCallback, useState } from "react";
import uniqueId from "lodash.uniqueid";

import { PushNotificationWithContext } from "./contexts";
import { DURATION_EXIT } from "./constants";
import { PushNotificationContent } from "./push-notification-content";

export const PushNotification = ({ children }) => {
  const [notificationInstances, setNotificationInstances] = useState(
    Object.freeze({})
  );

  const createInstance = useCallback((options) => {
    const id = uniqueId("push-notification-");

    setNotificationInstances((prevState) => ({
      ...prevState,
      [id]: { configs: [], ...options }
    }));

    const removeInstance = () => {
      setNotificationInstances(({ [id]: del, ...other }) => other);
    };

    const onShownNote = (noteId) => {
      setNotificationInstances((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          configs: prevState[id].configs.map((config) => {
            if (noteId === config.id || noteId === null) {
              return { ...config, shown: false };
            }

            return config;
          })
        }
      }));
    };

    const onCloseAllNote = () => {
      onShownNote(null);

      setTimeout(() => {
        setNotificationInstances((prevState) => ({
          ...prevState,
          [id]: { ...prevState[id], configs: [] }
        }));
      }, DURATION_EXIT);
    };

    const onCloseNote = (noteId) => {
      onShownNote(noteId);

      setTimeout(() => {
        setNotificationInstances((prevState) => ({
          ...prevState,
          [id]: {
            ...prevState[id],
            configs: prevState[id].configs.filter(
              (config) => config.id !== noteId
            )
          }
        }));
      }, DURATION_EXIT);
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
              { ...note, onCloseNote, onCloseAllNote, shown: true }
            ]
          }
        };
      });
    };

    return { onCreateNote, removeInstance, onCloseNote, onCloseAllNote };
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
