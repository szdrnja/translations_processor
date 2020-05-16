export const ACTION_BUTTON_TYPES = {
  optional: "OPTIONAL",
  mandatory: "MANDATORY",
  negate: "NEGATE",
};

export const TOAST_TYPES = {
  success: {
    generic: {
      key: "GENERIC_SUCCEESS",
      messageKey: "JSON has been successfully created",
      actionKey: "",
      displayType: "",
    },
  },
  error: {
    generic: {
      key: "GENERIC_ERROR",
      messageKey: "An error occurred. Please try again or contact support",
      actionKey: "",
      displayType: "ERROR",
    },
  },
};

export const ROUTES = {
  home: "/home",
  about: "/about",
  info: "/info",
  contact: "/contact",
  error: "/error",
};
