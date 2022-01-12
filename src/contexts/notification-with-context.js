import React, { createContext, useContext, useMemo } from "react";
import noop from "lodash.noop";

const DEFAULT_CONTEXT = {
  createInstance: () => ({
    onCreateNote: noop,
    removeInstance: noop
  })
};

const Context = createContext(DEFAULT_CONTEXT);

export const usePushNotificationContext = () => useContext(Context);

export const PushNotificationWithContext = ({ children, createInstance }) => {
  const value = useMemo(() => ({ createInstance }), [createInstance]);

  return <Context.Provider {...{ value }}>{children}</Context.Provider>;
};
