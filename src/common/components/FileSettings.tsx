import React, { FunctionComponent, useState } from "react";

import { DeleteIcon } from "../../assets/images";

import ActionButton from "./ActionButton";
import { ACTION_BUTTON_TYPES } from "../constants";

// Materiial UI
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

// TODO: fix any for function and style below
interface IProps {
  currentFile: File;
  deleteFile: () => void;
  uploadFile: () => void;
  headers: Array<string>;
}

export const getColumnsIndices = (headers: Array<string>) => {
  let columnsArray: Array<number> = [];
  for (let i = 1; i < headers.length; i++) {
    columnsArray.push(i);
  }
  return columnsArray;
};

const FileSettings: FunctionComponent<IProps> = ({
  currentFile,
  deleteFile,
  uploadFile,
  headers,
}) => {
  let defaultFileSettings = {
    headers,
    keyColumn: 0,
    columns: getColumnsIndices(headers),
    keySeparator: ".",
    containsHeaders: true,
    filePerLanguage: true,
    languageFirst: false,
  };

  const [fileSettings, setFileSettings] = useState(defaultFileSettings);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileSettings({
      ...fileSettings,
      [event.target.name]: event.target.checked,
    });
  };

  const renameHeader = (newHeader: string, index: number) => {
    console.log(newHeader);

    const x = fileSettings.headers.splice(index, 1, newHeader);

    setFileSettings({
      ...fileSettings,
      headers: fileSettings.headers,
    });
  };

  const processColumns = (columnIndex: number) => {
    let newColArray = [...fileSettings.columns];
    console.log(newColArray);

    if (fileSettings.columns.includes(columnIndex)) {
      const index = newColArray.indexOf(columnIndex);

      if (index > -1) {
        newColArray.splice(index, 1);
      }
    } else {
      // do i need to reorder these?
      newColArray.push(columnIndex);
    }

    setFileSettings({
      ...fileSettings,
      columns: newColArray,
    });
  };

  const selectKeyColumn = () => {};

  console.log(fileSettings);

  return (
    <div style={styles.settingsContainer}>
      <div style={{ marginTop: "17px" }}>
        <span style={{ marginRight: "1rem" }}>
          <b>Chosen File:</b> {currentFile.name}
        </span>
        <DeleteIcon
          onClick={deleteFile}
          style={{ maxWidth: "1rem", cursor: "pointer" }}
        />
      </div>

      <h3>Settings</h3>
      <div>
        <div>
          {/* containsHeaders --> Toggle - if file data contains headers (defaults) - loads first row as headers, if off, clear #1 only if !dirty */}
          <h4>File Contains Headers</h4>
          <Switch
            checked={fileSettings.containsHeaders}
            onChange={handleChange}
            name="containsHeaders"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
          {/* 1. headers --> row of headers all as prefilled input boxes  */}
          <div style={{ display: "flex" }}>
            {headers.map((header: string, index: number) => {
              return (
                <div key={index}>
                  <TextField
                    key={index + 50}
                    value={header}
                    variant="outlined"
                    disabled={fileSettings.containsHeaders}
                    onChange={(e) => {
                      renameHeader(e.target.value, index);
                    }}
                  />
                  {index}
                  <Checkbox
                    key={index + 100}
                    checked={fileSettings.columns.includes(index)}
                    onClick={() => processColumns(index)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </div>
              );
            })}
          </div>
          {/* 2. columns --> all with checkboxes underneath in order to select which column they want to process (default all checked except translation key)*/}
          {/* 3. keyColumn =-> radio buttons to select which column holds the translation keys (this cannot have a checked box)*/}
        </div>
        {/* 4. key separator (nesting) --> drop down of all the non-alphanumeric characters that exist within the first row of selected key column */}

        <div>
          {/* filePerLang -->  Toggle -drop down of all the non-alphanumeric characters that exist within the first row of selected key column */}
          {/* langFirst --> if !filePerLang, present option to select if the lang is first or last in the nest  */}
        </div>

        {/* 4. filename --> input field */}
      </div>
      <ActionButton
        style={styles.uploadButton}
        buttonType={ACTION_BUTTON_TYPES.mandatory}
        label="Upload File"
        action={uploadFile}
      />
    </div>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  settingsContainer: {},
  radioContainer: {
    margin: "5px",
  },
  uploadButton: { width: "50%", margin: "2rem auto" },
};

export default FileSettings;
