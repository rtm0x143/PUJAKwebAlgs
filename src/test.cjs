class ID3 {
    constructor(csvData) {
        this.csvData = csvData;
        this.rowLength = csvData[0].length;
        this.paramsArray = [];
        this.setParams();

        this.paramsObj = [];

        for (let i = 0; i < this.paramsArray.length; ++i) {
            this.paramsObj.push({
                value:  this.paramsArray[i],
                count: 0
            })
        }

        this.commonEntropy = this.calcCommonEntropy();
        this.used = [];

        for (let i = 0; i < this.rowLength; ++i) {
            this.used[i] = false;
        }
    }

    setParams() {
        for (let i = 1; i < this.csvData.length; ++i) {
            if (!this.paramsArray.includes(this.csvData[i][this.rowLength - 1])) {
                this.paramsArray.push(this.csvData[i][this.rowLength - 1]);
            }
        }
    }

    //don't touch - all work fine
    calcCommonEntropy() {
        for (let i = 0; i < this.paramsObj.length; ++i) {
            this.paramsObj[i].count = 0;
        }

        for (let i = 1; i < this.csvData.length; ++i) {
            for (let j = 0; j < this.paramsObj.length; ++j) {
                if (this.paramsObj[j].value === this.csvData[i][this.rowLength - 1]) {
                    ++this.paramsObj[j].count;
                }
            }
        }

        return this.calcEntropyFunc(this.paramsObj);
    }

    calcEntropyFunc(paramsObj) {
        let value = 0;
        let count = 0;
        // paramsObj.forEach(obj => {count += obj.count});
        for (let i = 0; i < paramsObj.length; ++i) {
            count += paramsObj[i].count;
        }

        for (let i = 0; i < paramsObj.length; ++i) {
            if (paramsObj[i].count === 0) {
                value = 0;
                break;
            }

            value -= (paramsObj[i].count / (count)) * Math.log2(paramsObj[i].count / (count));
        }

        return value;
    }

    setLabelsArray(index) {
        let labelsArray = [];

        for (let i = 1; i < this.csvData.length; ++i) {
            if (!labelsArray.includes(this.csvData[i][index])) {
                labelsArray.push(this.csvData[i][index]);
            }
        }

        return labelsArray;
    }

    calcLabelEntropy(index, label) {
        for (let i = 0; i < this.paramsObj.length; ++i) {
            this.paramsObj[i].count = 0;
        }

        for (let i = 1; i < this.csvData.length; ++i) {
            if (this.csvData[i][index] === label) {
                for (let j = 0; j < this.paramsObj.length; ++j) {
                    if (this.paramsObj[j].value === this.csvData[i][this.rowLength - 1]) {
                        ++this.paramsObj[j].count;
                    }
                }
            }
        }

        return this.calcEntropyFunc(this.paramsObj);
    }

    calcLabelCount(index, label) {
        let labelCount = 0;

        for (let i = 1; i < this.csvData.length; ++i) {
            if (this.csvData[i][index] === label) {
                ++labelCount;
            }
        }

        return labelCount;
    }


    calcFilterEntropy() {
        let gainValues = [];

        for (let i = 0; i < this.rowLength - 1; ++i) {
            if (!this.used[i]) {
                let gainValue = 0,
                    labelsArray = this.setLabelsArray(i);

                for (let j = 0; j < labelsArray.length; ++j) {
                    gainValue += (this.calcLabelCount(i, labelsArray[j]) / (this.csvData.length - 1))
                        * this.calcLabelEntropy(i, labelsArray[j]);
                }

                gainValues[i] = gainValue;
            }
        }

        for (let i = 0; i < gainValues.length; ++i) {
            gainValues[i] = this.commonEntropy - gainValues[i];
        }

        console.log(gainValues);

        return gainValues;
    }
}