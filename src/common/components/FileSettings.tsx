import React, { FunctionComponent, useState } from "react";

import { DeleteIcon } from "../../assets/images";

import ActionButton from "./ActionButton";
import { ACTION_BUTTON_TYPES } from "../constants";

// Materiial UI
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// TODO: fix any for function and style below
interface IProps {
  currentFile: File;
  deleteFile: () => void;
  uploadFile: (fileSettings: any, filename: string) => void;
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
    filePerLanguage: false,
    languageFirst: false,
  };

  const [fileSettings, setFileSettings] = useState(defaultFileSettings);
  const [filename, setFilename] = useState(currentFile.name);

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

  const processColumns = (columnIndex: number, remove?: boolean) => {
    let newColArray = [...fileSettings.columns];

    if (fileSettings.columns.includes(columnIndex) || remove) {
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

  const selectKeyColumn = (keyColumnEl: any) => {
    const keyColumn = parseInt((keyColumnEl as HTMLInputElement).value);
    console.log(keyColumn);

    // keyColumn not resetting
    setFileSettings({
      ...fileSettings,
      keyColumn: keyColumn,
    });

    console.log(fileSettings);

    processColumns(keyColumn, true);
  };

  const selectFromDropdown = (selectedItem: any, type?: string) => {
    if (type === "languageFirst") {
      selectedItem.value = JSON.parse(selectedItem.value);
    }

    setFileSettings({
      ...fileSettings,
      [selectedItem.name]: selectedItem.value,
    });
  };

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <h4>Input File Contains Headers: </h4>
            <Switch
              checked={fileSettings.containsHeaders}
              onChange={handleChange}
              name="containsHeaders"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </div>
          {/* 1. headers --> row of headers all as prefilled input boxes  */}
          <FormControl component="fieldset" style={{ margin: "1rem 0" }}>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={fileSettings.keyColumn}
              onChange={(e) => {
                selectKeyColumn(e.target);
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {headers.map((header: string, index: number) => {
                  return (
                    <div key={index} style={{ marginRight: "1rem" }}>
                      <TextField
                        style={{ maxWidth: "7rem" }}
                        key={index + 50}
                        value={header}
                        variant="outlined"
                        disabled={fileSettings.containsHeaders}
                        onChange={(e) => {
                          renameHeader(e.target.value, index);
                        }}
                      />
                      {/* {index} */}
                      {/* 2. columns --> all with checkboxes underneath in order to select which column they want to process (default all checked except translation key)*/}
                      <Checkbox
                        key={index + 100}
                        checked={fileSettings.columns.includes(index)}
                        onClick={() => processColumns(index)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                        disabled={fileSettings.keyColumn === index}
                      />
                      {/* 3. keyColumn =-> radio buttons to select which column holds the translation keys (this cannot have a checked box)*/}
                      <FormControlLabel
                        key={index + 150}
                        value={index}
                        control={<Radio />}
                        label="Contains Keys?"
                        // disabled={fileSettings.columns.includes(index)}
                      />
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </FormControl>
        </div>
        {/* 4. key separator (nesting) --> drop down of all the non-alphanumeric characters that exist within the first row of selected key column */}
        <Select
          value={fileSettings.keySeparator}
          name="keySeparator"
          onChange={(e) => {
            selectFromDropdown(e.target, e.target.name);
          }}
        >
          <MenuItem value={"."}>Dot Notation</MenuItem>
          <MenuItem value={"_"}>Underscore</MenuItem>
          <MenuItem value={"-"}>Dash</MenuItem>
          <MenuItem value={""}>Dash</MenuItem>
        </Select>

        <div>
          {/* 5. filePerLang -->  Toggle -drop down of all the non-alphanumeric characters that exist within the first row of selected key column */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <h4>Create Separate JSON File Per Language: </h4>
            <Switch
              checked={fileSettings.filePerLanguage}
              onChange={handleChange}
              name="filePerLanguage"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </div>
          {/* 6. langFirst --> if !filePerLang, present option to select if the lang is first or last in the nest  */}

          {fileSettings.filePerLanguage && (
            <div>
              <span>I would like the language to appear </span>
              <Select
                value={fileSettings.languageFirst.toString()}
                name="languageFirst"
                onChange={(e) => {
                  selectFromDropdown(e.target, e.target.name);
                }}
              >
                <MenuItem value={"true"}>first</MenuItem>
                <MenuItem value={"false"}>last</MenuItem>
              </Select>
              <span>in this nested JSON. </span>
            </div>
          )}
        </div>

        {/* 7. filename --> input field */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4 style={{ marginRight: "1rem" }}>Output Filename: </h4>
          <TextField
            style={{ width: "75%" }}
            value={filename}
            // variant="outlined"
            onChange={(e) => {
              setFilename(e.target.value);
            }}
          />
        </div>
      </div>
      <ActionButton
        style={styles.uploadButton}
        buttonType={ACTION_BUTTON_TYPES.mandatory}
        label="Upload File"
        action={() => uploadFile(fileSettings, filename)}
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
