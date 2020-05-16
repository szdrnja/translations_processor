import React, { FunctionComponent, useState } from "react";
// import { connect } from "react-redux";
// import { Dispatch } from "redux";
// import { saveLogo } from "packages/HotelConfig/actions";
import { colors } from "./assets/styles";
import Dropzone from "./common/components/Dropzone";
import Upload from "./common/components/Upload";
import { processExcelData } from "./processor-DONTTOUCH";

// import { IState } from "store/store";
import * as XLSX from "xlsx";
import ActionButton from "./common/components/ActionButton";
import { ACTION_BUTTON_TYPES } from "./common/constants";

interface IProps {
  // uploadLogo: ({ hotel }: { hotel: IHotel }, file: File) => void;
}

const App: FunctionComponent<IProps> = () => {
  const [currentFile, setCurrentFile] = useState<any>();
  const fileTypes = ".xlsx,.xls";
  const [error, setError] = useState(false);
  const setFiles = (files: FileList) => {
    if (
      files.length > 0 &&
      (files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        files[0].type === "application/vnd.ms-excel")
    ) {
      setError(false);
      setCurrentFile(files[0]);
    } else {
      setError(true);
      setCurrentFile(null);
    }
  };

  const uploadFile = () => {
    console.log("fetched file " + currentFile);
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        <span style={styles.title}>Translation Processor</span>

        <span style={styles.description}>
          Upload spreadsheets containing your translations here to be converted
          to JSON in your desired i18n structure.
        </span>

        <div style={styles.fileContainer}>
          {currentFile && <span>Chosen File: {currentFile.name}</span>}

          <div style={styles.buttonContainer}>
            <Upload
              setFiles={setFiles}
              label={currentFile ? "Reselect File" : "Choose File"}
              isButton={true}
              style={styles.link}
              acceptedFileTypes={fileTypes}
            />

            {currentFile && (
              <ActionButton
                style={styles.uploadButton}
                buttonType={ACTION_BUTTON_TYPES.negate}
                label="Upload File"
                action={uploadFile}
              />
            )}
          </div>
        </div>

        <Dropzone
          setFiles={setFiles}
          filesSet={false}
          acceptedFileTypes={fileTypes}
          allowMultipleFiles={false}
        />

        <ActionButton
          style={{ marginRight: "10px", ...styles.button }}
          buttonType={ACTION_BUTTON_TYPES.negate}
          label="Upload File"
          action={uploadFile}
        />

        {error && currentFile && <p style={styles.link}>Incorrect file type</p>}
      </div>
    </div>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    padding: "30px",
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
  },
  contentContainer: {
    flex: 1,
    display: "flex",
    maxWidth: "715px",
    flexDirection: "column",
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
  link: {
    color: colors.main.secondary,
    fontWeight: "bold",
    marginLeft: "15px",
  },
  uploadButton: {},
};

// const mapDispatchToProps = (dispatch: Dispatch) => ({
//   uploadLogo: ({ hotel }: { hotel: IHotel }, file: File) => {
//     dispatch(saveLogo({ hotel }, file));
//   },
// });

export default App;
