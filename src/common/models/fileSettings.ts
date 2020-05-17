export interface IFileSettings {
  outputName: string;
  headers: Array<any>; // gets default header names or specifies whiich header by column number
  keyColumn: number; // gets which column contains the translation keys
  columnsToProcess: Array<number>; // default to all columns, user can remove columns they do not want to process
  nestingSettings: {
    on: boolean; // if false, following are null
    notation: string | null; // DOT or UNDERSCORE
    langFirst: boolean; // is nesting meant to occur with {en: title: "Title"} or {}
  };
  singleFile: {
    on: boolean; // false, following are null
  };
}

export const notationType = {
  dot: "Dot Notatiion",
  underscore: "Underscore Delineation",
};

export const notationTypeList = [notationType.dot, notationType.underscore];
