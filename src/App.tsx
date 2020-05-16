import React, { FunctionComponent, useState } from "react";
import { colors } from "./assets/styles";
import Dropzone from "./common/components/Dropzone";
import { processExcelData } from "./processor-DONTTOUCH";
import * as XLSX from "xlsx";
import ActionButton from "./common/components/ActionButton";
import { ACTION_BUTTON_TYPES } from "./common/constants";

const App: FunctionComponent = () => {
  const fileTypes = ".xlsx,.xls";

  const [currentFile, setCurrentFile] = useState<any>();
  const [error, setError] = useState(false);
  const [isActive, setButtonStatus] = useState(false);

  const setFiles = (files: FileList) => {
    if (
      files.length > 0 &&
      (files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        files[0].type === "application/vnd.ms-excel")
    ) {
      setError(false);
      setCurrentFile(files[0]);
      setButtonStatus(true);
    } else {
      setError(true);
      setCurrentFile(null);
      setButtonStatus(false);
    }
  };

  const uploadFile = () => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e && e.target && e.target.result) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: "binary",
        });
        processExcelData(workbook, ".");
      }
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(currentFile);
    setCurrentFile(null);
    setButtonStatus(false);
  };

  return (
    <>
      <div style={styles.headerContainer}>
        <div
          onClick={() => alert("sydney loves stefan")}
          style={{ display: "flex", cursor: "pointer" }}
        >
          <span style={styles.betaTag}>Emdomy</span>
        </div>
      </div>
      <div style={styles.contentContainer}>
        <span style={styles.title}>Translation Processor</span>

        <span style={styles.description}>
          Upload spreadsheets containing your translations here to be converted
          to JSON in your desired i18n structure.
        </span>

        <p style={{ fontSize: "12px", color: "grey" }}>
          Accepted file types are: {fileTypes}
        </p>

        {currentFile && (
          <div style={styles.fileContainer}>
            <span>Chosen File: {currentFile.name}</span>
          </div>
        )}

        <Dropzone
          setFiles={setFiles}
          filesSet={false}
          acceptedFileTypes={fileTypes}
          allowMultipleFiles={false}
        />

        <ActionButton
          style={styles.uploadButton}
          buttonType={ACTION_BUTTON_TYPES.mandatory}
          label="Upload File"
          action={uploadFile}
          active={isActive}
        />

        {error && currentFile && <p style={styles.link}>Incorrect file type</p>}
      </div>
    </>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "30px",
    alignSelf: "center",
    maxWidth: "1400px",
    background: colors.main.primary,
  },
  contentContainer: {
    // flex: 1,
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: " 75%",
    padding: "2rem",
  },
  title: {
    fontSize: "21px",
    lineHeight: "22px",
  },
  description: {
    fontSize: "15px",
    lineHeight: "23px",
    marginTop: "15px",
  },
  fileContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "17px",
  },
  buttonContainer: {
    display: "flex",
    width: "50%",
    justifyContent: "space-between",
  },
  uploadButton: { width: "50%", margin: "0 auto" },
  link: {
    color: colors.main.secondary,
    fontWeight: "bold",
    marginLeft: "15px",
  },
};

export default App;
