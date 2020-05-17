import * as XLSX from "xlsx";

const DEV = true;

const debug = (a, b = null) => {
  if (DEV) {
    if (b !== null) {
      console.log(a, b);
    } else {
      console.log(a);
    }
  }
}

class Return {
  constructor(data = null, statusCode = 0, errorMessage = '') {
    this.data = data;
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}

class Processor {
  constructor(file) {
    this._db = {};
    this._ready = new Promise((resolve) => {
      this.readFileAsync(file).then((data) => {
        this.readAsync(data).then(resolve(0));
      });
    });
  }

  process(keyColumn, columns, keySeparator, containsHeaders, filePerLanguage, languageFirst) {
    const start = containsHeaders ? 1 : 0;
    debug('this._data', this._data);
    for (let i = start; i < this._data.length; i++) {
      let rc = this.processRow(this._data[i], keyColumn, columns, keySeparator, filePerLanguage, languageFirst);
      if (rc.statusCode) {
        return rc;
      }
    }
    if (filePerLanguage) {

    }
    return new Return();
  }

  processRow(row, keyColumn, columns, keySeparator, filePerLanguage, languageFirst) {
    const keylist = keySeparator != null ? row[keyColumn].split(keySeparator) : [row[keyColumn]];
    for (let i in columns) {
      let idx = columns[i];
      let kl = keylist;
      if (filePerLanguage || languageFirst) {
        kl = [this._headers[idx]].concat(keylist);
      } else {
        kl = keylist.concat([this._headers[idx]]);
      }

      let rc = this.populate(kl, row[idx]);
      if (rc.statusCode) {
        return rc;
      }
    }
    return new Return();
  }

  populate(keylist, data) {
    let cur = this._db;
    for (let i = 0; i < keylist.length - 1; i++) {
      const k = keylist[i].trim();
      if (!(k in cur)) {
        cur[k] = {};
      }
      cur = cur[k];
      if (!Utils.isDict(cur)) {
        debug('Key ' + keylist + ' overlaps with ' + keylist.slice(0, i));
        return new Return();
        // return new Return(null, 1, 'Key ' + keylist + ' overlaps with ' + keylist.slice(0, i));
      }
    }
    if (keylist[keylist.length - 1] in cur) {
      debug('Value for ' + keylist + ' already exists');
      return new Return();
      // return new Return(null, 1, 'Value for ' + keylist + ' already exists');
    }
    cur[keylist[keylist.length - 1]] = data;
    return new Return();
  }

  get db() { return this._db; }
  get headers() { return this._headers; }
  set headers(headers) { this._headers = headers; }
  get ready() { return this._ready; }
};

class ExcelProcessor extends Processor {
  readAsync(data) {
    return new Promise((resolve) => {
      let xlsx = XLSX.read(data, { type: 'binary' });
      this._data = [];
      let headers = null;
      for (const value of Object.values(xlsx.Sheets)) {
        // sheet_to_row_object_array
        let sheet = this._data.concat(XLSX.utils.sheet_to_json(value, {defval:null}));
        for (let i in sheet) {
          let values = Object.keys(sheet[i]).map(function (key) { return sheet[i][key]; });
          this._data.push(values);
        }
        if (!headers) {
          headers = Object.keys(sheet[0]).map(k => k.trim());
        }
      }
      this._headers = headers;
      this._data.unshift(this._headers);
      resolve(0);
    });
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsBinaryString(file);
    });
  }
};

class SeparatorProcessor extends Processor {
  constructor(file, separator) {
    super(file);
    this._separator = separator;
  }

  readAsync(data) {
    return new Promise((resolve) => {
      let rows = data.trim().split('\n');
      this._headers = rows[0].split(this._separator);
      this._data = [];
      for (let i in rows) {
        let trimmed = rows[i].split(this._separator).map(val => val.trim());
        this._data.push(trimmed);
      }
      resolve(0);
    });
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }
};

class TSVProcessor extends SeparatorProcessor {
  constructor(file) {
    super(file, '\t');
  }
};
class CSVProcessor extends SeparatorProcessor {
  constructor(file) {
    super(file, ',');
  }
};

export class Utils {
  static isDict(obj) {
    return typeof obj === "object" && !Array.isArray(obj);
  };
  static ext(file) {
    let filename = file.name;
    const splitByDot = filename.split('.');
    return splitByDot[splitByDot.length - 1];
  }
  static download(content, filename) {
    if (content instanceof Object) {
      content = JSON.stringify(content);
    }
    filename = filename + '.json';
    const file = new Blob([content], { type: 'application/json' });
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
    }
  };
  static stringFromUTF8Array(data) {
    const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
    var count = data.length;
    var str = "";

    for (var index = 0; index < count;) {
      var ch = data[index++];
      if (ch & 0x80) {
        var extra = extraByteMap[(ch >> 3) & 0x07];
        if (!(ch & 0x40) || !extra || ((index + extra) > count))
          return null;

        ch = ch & (0x3F >> extra);
        for (; extra > 0; extra -= 1) {
          var chx = data[index++];
          if ((chx & 0xC0) !== 0x80)
            return null;

          ch = (ch << 6) | (chx & 0x3F);
        }
      }

      str += String.fromCharCode(ch);
    }

    return str;
  }
}

export const EXT_PROCESSORS = {
  'xlsx': ExcelProcessor,
  'xls': ExcelProcessor,
  'tsv': TSVProcessor,
  'csv': CSVProcessor
};

let activeProcessor = null;

function initProcessor(file) {
  const ext = Utils.ext(file);
  if (ext in EXT_PROCESSORS) {
    debug('extension ' + ext + ' accepted');
    const ProcessorClass = EXT_PROCESSORS[ext];
    activeProcessor = new ProcessorClass(file);
    return new Return();
  }
  return new Return(null, 1, 'Extension ' + ext + ' not supported');
};

export async function fetchHeaders(file) {
  /**
   * Fetches the headers from the file - the
   * first row is accepted as the headers automatically.
   * @param file The file that is going to be processed
   * @return {Return}
   */
  debug('fetchHeaders');
  const rc = initProcessor(file);
  if (rc.statusCode) {
    return rc;
  }

  await activeProcessor.ready;
  debug('activeProcessor.headers', activeProcessor.headers);
  return new Return(activeProcessor.headers);
};

function setHeaders(headers) {
  /**
   * Sets the headers to be used by the processor.
   * This is if the user wants to change the existing headers or define headers by himthis.
   * @param {Array(String)} headers What to set the processor's headers to.
   * @return {Return}
   */
  if (!activeProcessor) {
    return new Return(null, 1, 'activeProcessor is not set.' +
      'Which means that fetchHeaders has not been called');
  }
  activeProcessor.headers = headers;
  return new Return();
}


export async function processFile(file, headers, keyColumn, columns, keySeparator = '.', containsHeaders = true,
  filePerLanguage = false, languageFirst = true) {
  /**
   * Processes the input file.
   *
   * @param file The input file.
   * @param {Array(String)} headers The headers for the data.
   * @param {int} keyColumn The index of the column that holds the translation key.
   * @param {Array(int)} columns The array of column indexes to be processed.
   * @param {char} keySeparator The separator of keys in the translation key column. ('.', '_', null <-- does not split keys)
   * @param {bool} containsHeaders Whether the file contains headers or not.
   * @param {bool} filePerLanguage Whether to create separate dumps per language.
   * @param {bool} languageFirst Whether the nesting of the language should be first or last
   * @return {Return}
   */
  let rc;
  if (!activeProcessor) {
    rc = initProcessor(file);
    if (rc.statusCode) {
      return rc;
    }
  }

  await activeProcessor.ready;
  rc = setHeaders(headers);
  if (rc.statusCode) {
    return rc;
  }
  rc = activeProcessor.process(keyColumn, columns, keySeparator, containsHeaders, filePerLanguage, languageFirst);
  if (rc.statusCode) {
    return rc;
  }
  let db = activeProcessor.db;
  activeProcessor = null;
  return new Return(db);
};
