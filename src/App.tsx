import React, { FunctionComponent, useState } from "react";

// Components
import Dropzone from "./common/components/Dropzone";
import FileSettings from "./common/components/FileSettings";
import ActionButton from "./common/components/ActionButton";
import ErrorContainer from "./common/components/ErrorContainer";

// Actions
import { fetchHeaders, processFile, EXT_PROCESSORS, Utils } from "./processor";

// Other
import { ACTION_BUTTON_TYPES } from "./common/constants";
import { colors } from "./assets/styles";

const App: FunctionComponent = () => {
  const fileTypes = "." + Object.keys(EXT_PROCESSORS).join(" .");

  const [currentFile, setCurrentFile] = useState<any>();
  const [newFile, setNewFile] = useState<any>();
  const [filePreview, setPreview] = useState<any>();
  const [headers, setHeaders] = useState([]);
  const [settings, setFileSettings] = useState<any>();

  const setFiles = (files: FileList) => {
    setNewFile(null);

    if (files.length) {
      fetchHeaders(files[0]).then((rc) => {
        if (rc.statusCode) {
          // error handling
          console.log(rc.errorMessage);
          return;
        }
        setHeaders(rc.data);
        setCurrentFile(files[0]);
      });
    }
  };

  const uploadFile = () => {
    processFile(currentFile, headers, 1, [2, 3], ".").then((rc) => {
      if (rc.statusCode) {
        // show error log
        console.log(rc.errorMessage);
        return;
      }
      setNewFile(rc.data);
      setPreview(JSON.stringify(rc.data, null, 2));
    });
    setCurrentFile(null);
  };

  const downloadFile = () => {
    Utils.download(newFile, "stefan");
    reset();
  };

  const reset = () => {
    setCurrentFile(null);
    setNewFile(null);
    errorLog = null;
  };

  let errorLog;

  errorLog = [
    {
      unprocessedKeys: ["LOGIN.LEMONS", "LOGIN.LEMONS.PIE"],
      reason: "Bad key structure",
      hint: "try making nesting levels unique",
    },
    {
      unprocessedKeys: ["BUTTON.NO", "BUTTON.NO"],
      reason: "Duplicate Keys",
      hint: "This was found in rows #7 & #54 of your original spreadsheet",
    },
  ];

  return (
    <>
      <div style={styles.headerContainer}>
        <div
          onClick={() => reset()}
          style={{ display: "flex", cursor: "pointer" }}
        >
          <h3>Stefan Loves Sydney</h3>
        </div>
      </div>
      <div style={styles.contentContainer}>
        <span style={styles.title}>Translation Processor</span>

        {!currentFile && !newFile && (
          <>
            <span style={styles.description}>
              Upload spreadsheets containing your translations here to be
              converted to JSON in your desired i18n structure.
            </span>
            <Dropzone
              setFiles={setFiles}
              acceptedFileTypes={fileTypes}
              allowMultipleFiles={false}
            />
          </>
        )}

        {currentFile && (
          <FileSettings
            currentFile={currentFile}
            deleteFile={reset}
            uploadFile={uploadFile}
            headers={headers}
          />
        )}

        {newFile && (
          <>
            <div style={styles.description}>
              <span>Your new translation file is ready to be downloaded</span>
              {errorLog && <span>, however there were a few errors.</span>}
            </div>
            <div>
              <span style={styles.description}>Preview File </span>
              <pre
                style={{
                  ...styles.previewContainer,
                  border: `2px dashed ${colors.main.secondary}`,
                }}
                id="json"
              >
                {filePreview}
              </pre>
              {errorLog && <ErrorContainer errors={errorLog} />}
            </div>
            <ActionButton
              style={styles.downloadButton}
              buttonType={ACTION_BUTTON_TYPES.optional}
              label="Download File"
              action={downloadFile}
            />
          </>
        )}
      </div>
    </>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem",
    alignSelf: "center",
    background: colors.main.primary,
  },
  contentContainer: {
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
    lineHeight: "23px",
    marginTop: "15px",
  },
  previewContainer: {
    overflow: "auto",
    maxHeight: "20rem",
    padding: "1rem",
  },
  downloadButton: {
    width: "50%",
    margin: "2rem auto",
  },
};

export default App;
