import React, { FunctionComponent } from "react";
import { colors } from "../../assets/styles";
import { ACTION_BUTTON_TYPES } from "../constants";

// TODO: fix any for function and style below
interface IProps {
  action: any;
  label: string;
  buttonType: string;
  style?: any;
  active?: boolean;
  icon?: any;
}

const getBorderColor = (type: string) => {
  switch (type) {
    case ACTION_BUTTON_TYPES.optional:
      return colors.highlight.info;
    case ACTION_BUTTON_TYPES.mandatory:
    case ACTION_BUTTON_TYPES.negate:
      return "transparent";
  }
};

const getColor = (type: string) => {
  switch (type) {
    case ACTION_BUTTON_TYPES.mandatory:
      return "#fff";
    case ACTION_BUTTON_TYPES.optional:
      return colors.highlight.info;

    case ACTION_BUTTON_TYPES.negate:
      return "#fff";
  }
};

const getBackgroundColor = (type: string) => {
  switch (type) {
    case ACTION_BUTTON_TYPES.mandatory:
      return colors.highlight.info;
    case ACTION_BUTTON_TYPES.optional:
      return "#fff";
    case ACTION_BUTTON_TYPES.negate:
      return colors.highlight.inactive;
  }
};

const ActionButton: FunctionComponent<IProps> = ({
  action,
  label,
  buttonType,
  style = {},
  active = true,
  icon,
}) => (
  <button
    style={{
      ...styles.action,
      border: `2px solid ${getBorderColor(buttonType)}`,
      ...style,
      backgroundColor: getBackgroundColor(buttonType),
      opacity: active ? 1 : 0.3,
    }}
    disabled={!active}
    onClick={(event) => {
      event.stopPropagation();
      action();
    }}
  >
    <span
      style={{
        color: getColor(buttonType),
      }}
    >
      {label}
    </span>
    {icon}
  </button>
);

const styles: { [name: string]: React.CSSProperties } = {
  action: {
    alignItems: "center",
    backgroundColor: "transparent",
    color: colors.main.light,
    borderRadius: "3px",
    fontWeight: "bold",
    height: "40px",
    fontSize: "16px",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer",
  },
  actionImage: {
    flexShrink: 0,
    marginLeft: "5px",
    transform: "rotate(90deg)",
  },
};

export default ActionButton;
