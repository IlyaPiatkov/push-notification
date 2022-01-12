import { useEffect, useRef } from "react";
import noop from "lodash.noop";

import { usePushNotificationContext } from "../contexts";
import {
  MAX_NOTIFICATION,
  Animation,
  HorizontalPositionElement,
  VerticalPositionElement
} from "../constants";

export const usePushNotification = (param) => {
  const options = {
    maxNote: MAX_NOTIFICATION,
    anchorOrigin: {
      vertical: VerticalPositionElement.TOP,
      horizontal: HorizontalPositionElement.RIGHT
    },
    animation: Animation.SLIDE,
    mix: "",
    ...param
  };

  const callbacks = useRef({
    removeInstance: noop,
    onCreateNote: noop
  });

  const { createInstance } = usePushNotificationContext();

  useEffect(() => {
    callbacks.current = createInstance(options);

    return () => {
      callbacks.current.removeInstance();
    };
  }, []);

  return {
    onCreateNote: (config) => callbacks.current.onCreateNote(config)
  };
};
