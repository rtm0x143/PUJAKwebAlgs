async function parseCSV(length, data) {
    let dataMatrix = [];

    let word = '';
    let dataArray = []

    for (let i = 0; i < data.length; ++i) {
        if (i === data.length - 1) {
            word += data[i];
            dataArray.push(word);
            dataMatrix.push(dataArray);
        }
        else if (data[i] === ',' || data[i] === '\n' || data[i] === ';') {
            dataArray.push(word);
            if (data[i] === '\r') {
                ++i;
            }
            word = '';

            console.log(dataArray);

            if (dataArray.length === length) {
                dataMatrix.push(dataArray);
                dataArray = []
            }
        } else {
            if (data[i] !== '\r') {
                word += data[i];
            }

        }
    }

    return dataMatrix;
}

async function fetchCSV() {
    let dataMatrix = []
    let wordsCounter = 0;

    await fetch(`1.csv`).then(async (response) => {
        let textData = await response.text();
        let flag = false

        for (let i = 0; i < textData.length; ++i) {
            if (flag) {
                break;
            }

            if (textData[i] === "," || textData[i] === ';') {
                ++wordsCounter;
            }
            else if (textData[i] === "\n" || textData[i] === '\r') {
                ++wordsCounter;
                flag = true;
            }
        }
        dataMatrix = await parseCSV(wordsCounter, textData);
        console.log(dataMatrix);
    })

    return {data: dataMatrix, length: wordsCounter};
}


let csvData;
fetchCSV()
    .then(async (response) => {
        //common dataset
        csvData = response.data;

        let nodesTree = [];
        let tree = [];

        let used = [];

        let lastClass = csvData[0][csvData[0].length - 1];

        mainData = csvData.filter((item) => {
            return item[item.length - 1] !== lastClass;
        })

        for (let i = 0; i < csvData[0].length - 1; ++i) {
            used[i] = false;
        }

        makeNode(csvData, used, nodesTree, tree, mainData, -1);
        console.log(nodesTree);
        console.log(tree);
    });
