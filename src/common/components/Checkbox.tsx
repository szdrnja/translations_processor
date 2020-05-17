import React, { FunctionComponent } from "react";
// import Radium from "radium";
import { CheckIcon } from "../../assets/images";
import { colors } from "../../assets/styles";

interface IProps {
  label: string;
  isChecked: boolean;
  action: any;
}

const CheckBox: FunctionComponent<IProps> = ({ label, isChecked, action }) => (
  <div onClick={action} style={styles.container}>
    {isChecked ? (
      <div
        style={{
          ...styles.checkbox,
          ...styles.isChecked,
        }}
      >
        <CheckIcon style={styles.icon} />
      </div>
    ) : (
      <div style={styles.checkbox} />
    )}
    <span style={styles.label}>{label}</span>
  </div>
);

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #e7e7e7",
    borderRadius: "3px",
    cursor: "pointer",
  },
  label: {
    fontSize: "16px",
    fontWeight: "normal",
    lineHeight: "1.38",
    margin: "0 0 0 10px",
    cursor: "pointer",
    userSelect: "none",
  },
  isChecked: {
    backgroundColor: colors.main.medium,
    border: "1px solid #63bbc3",
  },
  icon: {
    width: "16px",
  },
};

export default CheckBox;
