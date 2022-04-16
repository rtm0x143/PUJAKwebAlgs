class ID3 {
    constructor(csvData, length) {
        this.csvData = csvData;
        this.length = length;

        this.paramsArray = this.getParams();
        this.commonEntropy = this.calcEntropy();

        this.labelsArray = [];
        this.featureArray = [];
        this.treeQueue = [];

        this.used = [];
        for (let i = 0; i < this.length; ++i) {
            this.used[i] = false;
        }

        this.csvData.filter((item) => {
            console.log(item);
        })
    }

    getParams() {
        let paramsArray = [];

        for (let i = 1; i < this.csvData.length; ++i) {
            if (!paramsArray.includes(this.csvData[i][this.length - 1])) {
                paramsArray.push(this.csvData[i][this.length - 1]);
            }
        }

        return paramsArray;
    }

    calcEntropy() {
        let calcArray = [];

        for (let i = 0; i < this.paramsArray.length; ++i) {
            calcArray.push({ param: this.paramsArray[i], count: 0 })
        }

        for (let i = 0; i < this.csvData.length; ++i) {
            for (let j = 0; j < calcArray.length; ++j) {
                if (calcArray[j].param === this.csvData[i][this.length - 1]) {
                    ++calcArray[j].count;
                }
            }
        }

        let value = 0;

        for (let i = 0; i < calcArray.length; ++i) {
            value -= (calcArray[i].count / (this.csvData.length - 1))
                * Math.log2(calcArray[i].count / (this.csvData.length - 1));
        }

        return value;
    }

    generateLabelsArray(index) {
        this.labelsArray = [];

        for (let i = 1; i < this.csvData.length; ++i) {
            let flag = true;

            for (let j = 0; j < this.labelsArray.length; ++j) {
                if (this.labelsArray[j] === this.csvData[i][index]) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                this.labelsArray.push(this.csvData[i][index]);
            }

            flag = true;
        }
    }

    calcClassEntropy(index) {
        let featureCount = 0;

        for (let i = 0; i < this.labelsArray.length; ++i) {
            featureCount += this.calcLabelEntropy(this.labelsArray[i], index);
        }

        return featureCount;
    }

    calcLabelEntropy(label, index) {
        let calcArray = [];

        for (let i = 0; i < this.paramsArray.length; ++i) {
            calcArray.push({ param: this.paramsArray[i], count: 0 })
        }

        for (let i = 0; i < this.csvData.length; ++i) {
            if (this.csvData[i][index] === label) {
                for (let j = 0; j < calcArray.length; ++j) {
                    if (calcArray[j].param === this.csvData[i][this.length - 1]) {
                        ++calcArray[j].count;
                    }
                }
            }
        }

        let count = 0;

        for (let i = 0; i < this.paramsArray.length; ++i) {
            count += calcArray[i].count;
        }

        let value = 0;

        for (let i = 0; i < calcArray.length; ++i) {
            if (calcArray[i].count === 0) {
                value = 0;
                break;
            }

            value -= (calcArray[i].count / (count))
                * Math.log2(calcArray[i].count / (count));
        }

        return (count / (this.csvData.length - 1)) * value;
    }

    calcLabelEntropyOfSet(label, index, set) {
        let calcArray = [];

        for (let i = 0; i < this.paramsArray.length; ++i) {
            calcArray.push({ param: this.paramsArray[i], count: 0 })
        }

        for (let i = 0; i < set.length; ++i) {
            if (this.csvData[set[i]][index] === label) {
                for (let j = 0; j < calcArray.length; ++j) {
                    if (calcArray[j].param === this.csvData[set[i]][this.length - 1]) {
                        ++calcArray[j].count;
                    }
                }
            }
        }

        let count = 0;

        for (let i = 0; i < this.paramsArray.length; ++i) {
            count += calcArray[i].count;
        }

        let value = 0;

        for (let i = 0; i < calcArray.length; ++i) {
            if (calcArray[i].count === 0) {
                value = 0;
                break;
            }

            value -= (calcArray[i].count / (count))
                * Math.log2(calcArray[i].count / (count));
        }

        return (count / (this.csvData.length - 1)) * value;
    }

    calcFeature() {
        this.featureArray = [];

        for (let i = 0; i < this.length - 1; ++i) {
            if (!this.used[i]) {
                this.generateLabelsArray(i);
                this.featureArray[i] = this.commonEntropy - this.calcClassEntropy(i);
            }
        }
    }

    calcClassOffEntropy(set, index) {
        let featureCount = 0;

        for (let i = 0; i < this.labelsArray.length; ++i) {
            featureCount += this.calcLabelEntropyOfSet(set);
        }

        return featureCount;
    }

    calcSetFeature(set) {
        this.featureArray = [];

        for (let i = 0; i < this.length - 1; ++i) {
            if (!this.used) {
                this.generateLabelsArray(i);
                this.featureArray[i] = this.commonEntropy - this.calcClassOffEntropy(i);
            }
        }
    }

    getSetOfLabel(label, index) {
        let set = [];

        for (let i = 0; i < this.csvData.length; ++i) {
            if (this.csvData[i][index] === label) {
                set.push(i);
            }
        }

        return set;
    }

    generateTreeNode() {
        this.commonEntropy = this.calcEntropy();
        this.calcFeature();
        let feature = { value: Number.MIN_VALUE, index: 0 };

        for (let i = 0; i < this.featureArray.length; ++i) {
            if (this.featureArray[i] > feature.value) {
                feature.value = this.featureArray[i];
                feature.index = i;
            }
        }

        this.generateLabelsArray(feature.index);
        this.treeQueue.push({ name: this.csvData[0][feature.index], value: '?' })

        let values = []

        for (let i = 0; i < this.labelsArray.length; ++i) {
            values[i] = this.calcLabelEntropy(this.labelsArray[i], feature.index);

            this.treeQueue.push({
                parent: {
                    name: this.csvData[0][feature.index],
                    index: feature.index
                },
                set: [],
                name: this.labelsArray[i],
                value: values[i] > 0 ? '?' : '-',
            });
        }

        for (let i = 0; i < values.length; ++i) {
            if (values[i] === 0) {
                this.csvData = this.csvData.filter((item) => {
                    return item[feature.index] !== this.labelsArray[i];
                })
            }
        }

        this.used[feature.index] = true;
        this.treeQueue.shift();
    }

    generateTreeLeaf() {
        if (this.treeQueue.length > 0 && this.treeQueue[0].value !== '?') {
            this.treeQueue.shift();
            return;
        }

        let parentNode = this.treeQueue.shift();
        parentNode.set = this.getSetOfLabel(parentNode.name, parentNode.parent.index);
        this.commonEntropy = this.calcEntropy();
        this.calcFeature();

        let feature = { value: Number.MIN_VALUE, index: 0 };

        for (let i = 0; i < this.featureArray.length; ++i) {
            if (this.featureArray[i] > feature.value) {
                feature.value = this.featureArray[i];
                feature.index = i;
            }
        }

        this.generateLabelsArray(feature.index);
        this.treeQueue.push({ name: this.csvData[0][feature.index], value: '?' })

        let values = []

        for (let i = 0; i < this.labelsArray.length; ++i) {
            values[i] = this.calcLabelEntropyOfSet(this.labelsArray[i], feature.index, parentNode.set);

            this.treeQueue.push({
                parent: {
                    name: this.csvData[0][feature.index],
                    index: feature.index
                },
                set: [],
                name: this.labelsArray[i],
                value: values[i] > 0 ? '?' : '-',
            });
        }

        console.log(values);
        for (let i = 0; i < values.length; ++i) {
            if (values[i] === 0) {
                this.csvData = this.csvData.filter((item) => {
                    return item[feature.index] !== this.labelsArray[i];
                })
            }
        }

        this.used[feature.index] = true;
        this.treeQueue.shift();
    }
}