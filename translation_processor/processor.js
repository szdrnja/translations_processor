const download = (content, name, type) => {
    const file = new Blob([content], {type: type});
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveOrOpenBlob(file, name);
    } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }
};

const isDict = (dict) => {
    return typeof dict === "object" && !Array.isArray(dict);
};

const populate = (db, keylist, data) => {
    var cur = db;
    for (let i=0; i < keylist.length - 1; i++) {
        const k = keylist[i].trim();
        if (!(k in cur)) {
            cur[k] = {};
        }
        cur = cur[k];
        if (!isDict(cur)) {
            // overlap fo keys
            return 1;
        }
    }
    if (keylist[keylist.length-1] in cur) {
        // value already exists
        return 2;
    }
    cur[keylist[keylist.length-1]] = data
    return 0
};

const processRow = (db, row, keySeparator, keyColumn, indexColumn) => {
    if (!row[keyColumn]) {
        return 1;
    }
    const keylist = row[keyColumn].split(keySeparator);
    for (const [key, value] of Object.entries(row)) {
        if (key !== keyColumn && key != indexColumn) {
            populate(db, [key].concat(keylist), value);
        }
    }
    return 0;
};

const processExcelData = (workbook, keySeparator, keyColumn ='Translation Key', indexColumn ='INDEX') => {
    var db = {};
    workbook.SheetNames.forEach(function (sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        XL_row_object.forEach(row => {
            processRow(db, row, '.', keyColumn, indexColumn);
        });
        console.log(db);
        download(JSON.stringify(db), 'processed.json', 'application/json');
    });
};
