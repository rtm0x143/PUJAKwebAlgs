import data from './errorMessages.json' assert {type: 'json'};

class Errors {
    static handleError(errorType: string): never {
        switch(errorType) {
            case 'null': {
                throw new Error(JSON.parse(data.toString()).nullReference);
            }

            case 'undefined': {
                throw new Error(JSON.parse(data.toString()).undefined);
            }

            case 'invalidType': {
                throw new Error(JSON.parse(data.toString()).typeError);
            }

            default: {
                throw new Error("Unhandled exception");
            }
        }
    }
}

export default Errors;