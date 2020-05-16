import React, { FunctionComponent, useRef } from "react";
import ActionButton from "./ActionButton";
import { ACTION_BUTTON_TYPES } from "../constants";

interface IProps {
  setFiles: (file: any) => void;
  label: string;
  isButton?: boolean;
  style?: any;
  acceptedFileTypes?: string;
}

const Upload: FunctionComponent<IProps> = ({
  setFiles,
  label,
  isButton = true,
  style,
  acceptedFileTypes,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    const currentRef = fileInputRef.current;
    if (currentRef) {
      currentRef.click();
    }
  };
  return (
    <>
      <input
        accept={acceptedFileTypes}
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={({ target: { validity, files } }) =>
          validity.valid && setFiles(files)
        }
      />
      {isButton ? (
        <ActionButton
          buttonType={ACTION_BUTTON_TYPES.mandatory}
          label={label}
          action={onClick}
          style={{ ...(style && style) }}
        />
      ) : (
        <div
          onClick={onClick}
          style={{ cursor: "pointer", ...(style && style) }}
        >
          <span>{label}</span>
        </div>
      )}
    </>
  );
};

export default Upload;
