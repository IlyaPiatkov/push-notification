import React, { memo } from "react";
import classNames from "classnames";

import { PushNotificationItem } from "./push-notification-item";
import {
  Animation,
  HorizontalPositionElement,
  VerticalPositionElement
} from "./constants";

export const PushNotificationContent = memo(function PushNotificationContent(
  props
) {
  const { maxNote, configs, anchorOrigin, animation, mix } = props;

  const content = [];

  for (let index = 0; index < configs.length; index++) {
    const { customItem, ...rest } = configs[index];

    if (Math.abs(maxNote) <= index && maxNote !== 0) {
      break;
    }

    if (customItem) {
      content.push(customItem(rest));
    } else {
      content.push(<PushNotificationItem key={rest.id} {...rest} />);
    }
  }

  const containerClasses = classNames("push-notification", {
    "push-notification_bottom-left":
      anchorOrigin.vertical === VerticalPositionElement.BOTTOM &&
      anchorOrigin.horizontal === HorizontalPositionElement.LEFT,
    "push-notification_bottom-right":
      anchorOrigin.vertical === VerticalPositionElement.BOTTOM &&
      anchorOrigin.horizontal === HorizontalPositionElement.RIGHT,
    "push-notification_top-left":
      anchorOrigin.vertical === VerticalPositionElement.TOP &&
      anchorOrigin.horizontal === HorizontalPositionElement.LEFT,
    "push-notification_top-right":
      anchorOrigin.vertical === VerticalPositionElement.TOP &&
      anchorOrigin.horizontal === HorizontalPositionElement.RIGHT,
    "push-notification_slide": animation === Animation.SLIDE,
    "push-notification_fade": animation === Animation.FADE,
    [mix]: mix
  });

  return <div className={containerClasses}>{content}</div>;
});
