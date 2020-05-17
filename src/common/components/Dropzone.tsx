import React, { FunctionComponent, useRef, useState } from "react";
import { colors } from "../../assets/styles/variables";
import { PlusIcon, UploadIcon } from "../../assets/images";

interface IProps {
  setFiles: (file: any) => void;
  acceptedFileTypes?: string;
  allowMultipleFiles?: boolean;
}

const Dropzone: FunctionComponent<IProps> = ({
  setFiles,
  acceptedFileTypes,
  allowMultipleFiles,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showErrorMessage, setErrorMessage] = useState(false);

  const checkType = (files: FileList) => {
    setErrorMessage(false);
    let isInvalidFile = false;

    Array.from(files).forEach((file) => {
      const validFileCheckList = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!validFileCheckList.includes(file.type)) {
        isInvalidFile = true;
      }
    });

    if (isInvalidFile) {
      setErrorMessage(true);
    } else {
      setFiles(files);
    }
  };

  if (showErrorMessage) {
    setTimeout(() => {
      setErrorMessage(false);
    }, 2500);
  }

  return (
    <>
      <p style={{ fontSize: "12px", color: "grey" }}>
        Accepted file types are: {acceptedFileTypes}
      </p>
      <div
        style={{
          ...styles.dropZone,
          borderColor: isDragOver ? colors.main.primary : colors.main.secondary,
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          checkType(event.dataTransfer.files);
        }}
      >
        <UploadIcon style={styles.uploadIcon} />
        <h3 style={styles.description}>Drag and Drop Here</h3>

        <input
          accept={acceptedFileTypes}
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={({ target: { validity, files } }) =>
            validity.valid && setFiles(files)
          }
          multiple={allowMultipleFiles}
        />

        <div style={{ margin: "10px auto", display: "contents" }}>
          {!isDragOver && (
            <>
              {!showErrorMessage && (
                <>
                  <p style={{ margin: "0 0 1.5rem 0" }}>or</p>
                  <div
                    style={styles.alternativeAtionContainer}
                    onClick={() => {
                      const currentRef = fileInputRef.current;
                      if (currentRef) {
                        currentRef.click();
                      }
                    }}
                  >
                    <PlusIcon style={styles.alternativeActionIcon} />
                    <span style={styles.alternativeAction}>Choose File</span>
                  </div>
                </>
              )}
              {showErrorMessage && (
                <div
                  style={styles.errorMessage}
                  onClick={() => {
                    const currentRef = fileInputRef.current;
                    if (currentRef) {
                      currentRef.click();
                    }
                  }}
                >
                  <span style={{ fontWeight: "bold", paddingLeft: "5px" }}>
                    ERROR: Invalid File Type
                  </span>
                  <span>Please upload a valid file here</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
const styles: { [name: string]: React.CSSProperties } = {
  dropZone: {
    padding: "3rem",
    border: `2px dashed`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "15rem",
    textAlign: "center",
  },
  uploadIcon: {
    width: "66px",
    height: "66px",
  },
  description: {
    marginBottom: "15px",
  },
  alternativeAtionContainer: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px auto",
    width: "100%",
  },
  alternativeAction: {
    color: colors.main.secondary,
    marginLeft: "5px",
    fontWeight: "bold",
  },
  alternativeActionIcon: {
    color: colors.main.secondary,
    height: "1rem",
  },
  errorMessage: {
    background: "white",
    color: colors.highlight.warning,
    padding: "10px 15px",
    borderRadius: "3px",
    fontSize: "14px",
    border: "2px solid",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
};
export default Dropzone;
