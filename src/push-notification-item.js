import React, { useCallback, useState, memo, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import classNames from "classnames";
import Button from "@material-ui/core/Button";

import {
  Status,
  DURATION_ENTER,
  DURATION_EXIT,
  INDENT_BETWEEN_ITEM
} from "./constants";

export const PushNotificationItem = memo(function PushNotificationItem({
  body,
  shown,
  message,
  onCloseNote,
  onCloseAllNote,
  status = Status.DEFAULT,
  id,
  autoHideTimeout = 0,
  buttonProps
}) {
  const [busy, setBusy] = useState(false);

  const timeout = useRef();
  const height = useRef("auto");

  const containerClasses = classNames("push-notification-item__container", {
    "push-notification-item__container_default": status === Status.DEFAULT,
    "push-notification-item__container_error": status === Status.ERROR,
    "push-notification-item__container_success": status === Status.SUCCESS,
    "push-notification-item__container_warning": status === Status.WARNING
  });

  const _onClose = async () => {
    const handler = buttonProps?.handler;
    const callback = handler instanceof Function ? handler() : null;

    if (callback && callback instanceof Promise) {
      setBusy(true);
      await callback;
      setBusy(false);
    }
  };

  const onClose = async () => {
    await _onClose();

    onCloseNote(id);
  };

  const onCloseAll = async () => {
    await _onClose();

    onCloseAllNote();
  };

  const onEnteringCallback = useCallback((element) => {
    height.current = `${element.clientHeight + INDENT_BETWEEN_ITEM}px`;
  }, []);

  const onExitCallback = useCallback(() => {
    height.current = "0px";
  }, []);

  useEffect(() => {
    if (autoHideTimeout) {
      timeout.current = setTimeout(onClose, autoHideTimeout);

      return () => {
        clearTimeout(timeout.current);
      };
    }
  }, [autoHideTimeout]);

  return (
    <Transition
      in={shown}
      timeout={{
        appear: 0,
        enter: DURATION_ENTER,
        exit: DURATION_EXIT
      }}
      appear={true}
      unmountOnExit={true}
      onEntering={onEnteringCallback}
      onExit={onExitCallback}
    >
      {(state) => (
        <div
          className="push-notification-item"
          style={{ height: height.current }}
        >
          <div className={classNames(containerClasses, state)}>
            <div className="push-notification-item__content">
              {body ? body({ onClose, onCloseAll }) : <span>{message}</span>}
              {buttonProps && (
                <Button onClick={onClose} disabled={busy}>
                  {buttonProps.caption}
                </Button>
              )}
              <Button onClick={onCloseAll}>Close All</Button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
});
