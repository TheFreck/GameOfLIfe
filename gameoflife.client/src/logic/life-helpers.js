const LifeHelpers = {
    padLife: (input) => {
        let output = [];
        for (let i = 0; i < input.length + 2; i++) {
            output[i] = [];
            for (let j = 0; j < input[0].length+2; j++) {
                if (i === 0 || i > input.length || j === 0 || j > input[0].length) {
                    output[i].push(false);
                }
                else {
                    output[i].push(input[i - 1][j - 1]);
                }
            }
        }
        return output;
    },

    countNeighbors: (input) => {
        let output = [[]];
        for (let i = 0; i < input.length; i++) {
            output[i] = [];
            for (let j = 0; j < input[i].length; j++) {
                output[i][j] = 0;
                for (let k = i - 1; k <= i + 1; k++) {
                    for (let l = j - 1; l <= j + 1; l++) {
                        if ((k != i || l != j)
                            && k >= 0
                            && l >= 0
                            && k < input.length
                            && l < input[0].length
                            && input[k][l] != null
                            && input[k][l]
                        ) {
                            output[i][j]++;
                        }
                    }
                }
            }
        }
        return output;
    },

    proceed: (input,cb) => {
        //console.log("proceed input: ", input);
        if (input?.length > 0) {
            let paddedLife = LifeHelpers.padLife(input);
            let countedLife = LifeHelpers.countNeighbors(paddedLife);
            let life = LifeHelpers.determineLifeAndDeath(countedLife, paddedLife);
            const unpaddedLife = LifeHelpers.unPadLife(life);
            //console.log("proceed output: ", unpaddedLife);
            cb(unpaddedLife);
        }
        return cb(input);
    },

    unPadLifeVertical: (input) => {
        let output = [];
        for (let i = 1; i < input.length-1; i++) {
            output[i-1] = input[i];
        }
        return output;
    },

    flipLife: (input) => {
        let flipped = [];
        for (let i = 0; i < input[0].length; i++) {
            flipped[i] = [];
            for (let j = 0; j < input.length; j++) {
                flipped[i][j] = input[j][i];
            }
        }
        return flipped;
    },

    unPadLife: (input) => {
        return LifeHelpers.flipLife(LifeHelpers.unPadLifeVertical(LifeHelpers.flipLife(LifeHelpers.unPadLifeVertical(input))));
    },

    determineLifeAndDeath: (inputCount, inputLife) => {
        let output = [];
        for (let i = 0; i < inputCount.length; i++) {
            output[i] = [];
            for (let j = 0; j < inputCount[i].length; j++) {
                if (inputLife[i][j] && (inputCount[i][j] == 2 || inputCount[i][j] == 3)) {
                    output[i][j] = true;
                }
                else if (!inputLife[i][j] && inputCount[i][j] == 3) {
                    output[i][j] = true;
                }
                else {
                    output[i][j] = false;
                }
            }
        }
        return output;
    }
}

export default LifeHelpers;