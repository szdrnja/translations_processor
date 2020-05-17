import React, { FunctionComponent, useState } from "react";
import {
  IFileSettings,
  notationTypeList,
  notationType,
} from "../../common/models";
import { DeleteIcon } from "../../assets/images";

import RadioButtonsGroup from "./RadioButtonGroup";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ActionButton from "./ActionButton";
import { ACTION_BUTTON_TYPES } from "../constants";

// TODO: fix any for function and style below
interface IProps {
  currentFile: File;
  deleteFile: () => void;
  uploadFile: () => void;
}

const FileSettings: FunctionComponent<IProps> = ({
  currentFile,
  deleteFile,
  uploadFile,
}) => {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [userFileSettings, setUserFileSettings] = useState<IFileSettings>({
    outputName: "New File",
    headers: [],
    keyColumn: 1,
    columnsToProcess: [4, 6, 8],
    nestingSettings: {
      on: false,
      notation: null,
      langFirst: false,
    },
    singleFile: {
      on: false,
    },
  });
  console.log(userFileSettings);

  const options = [
    [
      { category: "Nesting", label: "With Nesting" },
      { category: "Nesting", label: "Without Nesting" },
    ],
    [
      { category: "Notation", label: "Dot Notation" },
      { category: "Notation", label: "Underscore Notation" },
    ],
    [
      { category: "Number of Files", label: "Out into a single File" },
      {
        category: "Number of Files",
        label: "Output into a .json per language",
      },
    ],
  ];

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
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedA}
                onChange={handleChange}
                name="checkedA"
                color="default"
              />
            }
            label="Nesting?"
          />
          <div style={styles.radioContainer}>
            <h4>Notation Types</h4>
            <RadioButtonsGroup
              key={Date.now()}
              // title={"Notation Types"}
              defaultValue={notationTypeList[0]}
              options={notationTypeList}
            ></RadioButtonsGroup>
            <RadioButtonsGroup
              key={Date.now()}
              // title={"Notation Types"}
              defaultValue={notationTypeList[notationTypeList.length - 1]}
              options={notationTypeList}
            ></RadioButtonsGroup>
          </div>
        </FormGroup>
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
};

export default FileSettings;
