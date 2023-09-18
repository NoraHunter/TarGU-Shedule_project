class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
    _first() {
        return this.first;
    }
    _second() {
        return this.second;
    }
}

function reg(str) {
    if (str.length <= 0)
        return [];
    let result = []
    let listMatches = str.toString().match(/[А-Я][а-я]+ [А-Яа-я. \n]+\d+\.\d+-\d+/g);
    if (listMatches != null) {
        for (let i = 0; i < listMatches.length; ++i) {
            let nameSurname = listMatches[i].match(/[А-Я][а-я]+/g).join('');
            let auditory = listMatches[i].match(/\d+/g).join('');
            result.push(new Pair(nameSurname, auditory));
        }
        return result;
    }

    let numMatch = str.match(/\d+/g);
    if (numMatch == null)
        return [];
    return [new Pair("none", numMatch.join('')), ];
}

function onEdit(e) {
    let sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    let activeSheet = SpreadsheetApp.getActiveSheet();
    let activeCell = activeSheet.getActiveCell();
    let errorMessageCell = "B8";

    for (let i = 0; i < sheets.length; ++i) {
        if (sheets[i].getName() === activeSheet.getName())
            continue;
        let anotherSheetCellVal = sheets[i].getRange(activeCell.getRow(), activeCell.getColumn()).getValue().toString();
        let currentSheetCellVal = activeCell.getValue().toString();

        let c_regList_1 = reg(currentSheetCellVal);
        let a_regList_2 = reg(anotherSheetCellVal);
        Logger.log(c_regList_1);
        Logger.log(a_regList_2);
        for (let c = 0; c < c_regList_1.length; ++c) {
            for (let a = 0; a < a_regList_2.length; ++a) {
                if (c_regList_1[c]._second() == a_regList_2[a]._second() &&
                    c_regList_1[c]._first() != a_regList_2[a]._first()) {
                    activeSheet.getRange(errorMessageCell).setValue(
                        "Error! Conflict with " + a_regList_2[a]._first() + " at list " + sheets[i].getName() + ":" + activeCell.getA1Notation()
                    ).setBackgroundRGB(236, 14, 14);
                    return;
                }
            }
        }
        Logger.log('');
    }
    SpreadsheetApp.getActiveSheet().getRange(errorMessageCell).setValue(" ").setBackgroundRGB(31, 194, 68);
}
