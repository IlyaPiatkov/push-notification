import React, { useCallback, useState } from "react";
import uniqueId from "lodash.uniqueid";
import Button from "@material-ui/core/Button";

import { PushNotification } from "./push-notification";
import { usePushNotification } from "./hooks";
import {
  Status,
  Animation,
  VerticalPositionElement,
  HorizontalPositionElement
} from "./constants";

import "./push-notification.scss";

const testPromiseFn = () => {
  const testPromise = new Promise((resolve) => {
    setTimeout(() => {
      console.log("done testPromiseFn");
      resolve();
    }, 5000);
  });
  return testPromise;
};

const testFn = () => {
  console.log("done testFn");
};

const Content1 = () => {
  const { onCreateNote, onCloseNote, onCloseAllNote } = usePushNotification({
    maxNote: -3
  });

  const onClick1 = useCallback(() => {
    const id = uniqueId();

    onCreateNote({
      body: null,
      customItem: null,
      message: `test text ${id}`,
      id,
      buttonProps: {
        caption: "Close",
        onClose: testPromiseFn
      }
    });
  }, [onCreateNote]);

  const onClick2 = useCallback(() => {
    const id = uniqueId();
    onCreateNote({
      body: null,
      customItem: null,
      message:
        "test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 ",
      id,
      status: Status.ERROR,
      autoHideTimeout: 3000
    });
  }, [onCreateNote]);

  const onClick3 = useCallback(() => {
    const id = uniqueId();
    onCreateNote({
      body: null,
      customItem: null,
      message: `test text ${id}`,
      id,
      status: Status.SUCCESS,
      buttonProps: {
        caption: "Close",
        onClose: testFn
      }
    });
  }, [onCreateNote]);

  const onClick4 = useCallback(() => {
    const id = uniqueId();
    onCreateNote({
      body: null,
      customItem: null,
      message: "test2",
      // onCloseNote,
      autoHide: false,
      id,
      status: Status.WARNING,
      buttonProps: {
        caption: "Close",
        onClose: testFn
      }
    });
  }, [onCreateNote]);

  const onClick5 = useCallback(() => {
    onCreateNote({
      message: "test2",
      id: "staticId",
      buttonProps: {
        caption: "Close",
        onClose: testFn
      }
    });
  }, [onCreateNote]);

  return (
    <div className="buttons">
      <Button onClick={onClick1}>DEFAULT</Button>
      <Button onClick={onClick2}>Long text</Button>
      <Button onClick={onClick3}>SUCCESS</Button>
      <Button onClick={onClick4}>warning</Button>
      <Button onClick={onClick5}>Static id</Button>
      <Button onClick={onCloseAllNote}>Close All Note</Button>
      <Button
        onClick={() => {
          onCloseNote("staticId");
        }}
      >
        Close Note(staticId)
      </Button>
    </div>
  );
};

const Content2 = () => {
  const { onCreateNote } = usePushNotification({
    maxNote: 5,
    anchorOrigin: {
      vertical: VerticalPositionElement.BOTTOM,
      horizontal: HorizontalPositionElement.LEFT
    },
    animation: Animation.FADE
  });

  const onClick1 = () => {
    const id = uniqueId();

    onCreateNote({
      body: null,
      customItem: null,
      message: `test text ${id}`,
      id,
      buttonProps: {
        caption: "Close",
        onClose: testFn
      }
    });
  };

  return (
    <div className="buttons">
      <Button onClick={onClick1}>DEFAULT</Button>
    </div>
  );
};

export const App = () => {
  const [shown, setShown] = useState(true);

  const onToggle = () => {
    setShown((state) => !state);
  };
  return (
    <div className="container">
      <Button onClick={onToggle}>TOGGLE</Button>
      <PushNotification>
        {shown && <Content1 />}
        <Content2 />
      </PushNotification>
    </div>
  );
};
