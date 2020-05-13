import pandas as pd
import os
import sys
from pathlib import Path
from argparse import ArgumentParser, ArgumentTypeError
import math
import numbers
import json
__script_filepath = Path(sys.argv[0])

TRANSLATION_KEY = 'Translation Key'
INDEX = 'INDEX'


def check_positive_int(value):
    if not isinstance(value, int):
        raise ArgumentTypeError('Not integer')
    if value <= 0:
        raise ArgumentTypeError(
            f'Only positive values accepted. Received {value}')

def parser():
    """
        Creates the ArgumentParser object to be used to parse
        arguments from the command line.
        :returns:   ArgumentParser
    """
    parser = ArgumentParser(description="Dot to JSON Translation Converter")
    parser.add_argument('input_file',
                        help=f'Excel file to be processed. Can contain data in multiple sheets.')
    parser.add_argument('output_file', default='dump.json',
                        help=f'Output filename')
    parser.add_argument('-v', '--verbose', default=False,
                        help=f'Log informative messages.')
    parser.add_argument('-s', '--sheet', default=None, type=check_positive_int,
                        help=f'Process only a specific sheet. By default all sheets are processed and merged.')
    return parser

error_cnt = 0
def error(msg, exit=False):
    global error_cnt
    error_cnt += 1
    print(f'ERROR: {msg}')
    if exit:
        print('Aborting.')
        sys.exit(1)


def populate(db, keylist, data):
    cur = db
    for idx, key in enumerate(keylist[:-1]):
        k = key.strip()
        if k not in cur:
            cur[k] = {}
        cur = cur[k]
        if not isinstance(cur, dict):
            error(f'Overlap of keys {keylist[:idx+1]} and {keylist}')
            return 1
    if keylist[-1] in cur:
        error(f'Value under {keylist} already exists')
        return 1
    cur[keylist[-1]] = data
    return 0


def process_row(db, row):
    if not row[TRANSLATION_KEY]:
        return 1
    keylist = row[TRANSLATION_KEY].split('.')

    for col in list(row.keys()):
        if col not in [INDEX, TRANSLATION_KEY]:
            data = row[col]
            if data and not (isinstance(data, numbers.Number) and math.isnan(data)):
                rc = populate(db, [col] + keylist, row[col])
                if rc:
                    print(
                        f'Column {col} of {row[TRANSLATION_KEY]} not processed.')

    return 0


if __name__ == "__main__":
    parser = parser()
    args = parser.parse_args()

    xlsx = pd.ExcelFile(args.input_file)
    sheets = []
    for idx, sheet in enumerate(xlsx.sheet_names):
        sheets.append(xlsx.parse(sheet))
    xlsx_df = pd.concat(sheets)
    if args.verbose:
        print(f'Read input file {args.input_file}')
    # xl_data = pd.read_excel(os.path.join(os.fspath(__script_filepath.parent), 'input.xlsx'), sheetname=None)
    cols = list(xlsx_df.keys())
    if args.verbose:
        print(f'Found the following columns in the : {cols}')
    if TRANSLATION_KEY not in cols:
        error(
            f'There is no column named {TRANSLATION_KEY}. This column is necessary for processing.', exit=True)

    db = {}
    for idx, row in xlsx_df.iterrows():
        rc = process_row(db, row)
        if rc:
            error(f'Row not processed: {row}')

    if args.verbose:
        if error_cnt:
            print(f'Input file {args.input_file} processed with {error_cnt} errors.')
        else:
            print(f'Input file {args.input_file} processed without any issues.')


    with open(args.output_file, 'w') as ofile:
        json.dump(db, ofile)

    if args.verbose: print(f'Result of processing dumped to {args.output_file}')
