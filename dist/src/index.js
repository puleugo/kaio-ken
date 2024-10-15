import * as core from '@actions/core';
import { app } from "./app.js";
const methodObject = {
    'READ': () => app.generateOriginalPost(),
    'PUBLISH': () => new Promise(resolve => resolve()),
    'UPDATE_SPREAD_SHEEt': () => app.updateSpreadSheetSettings(),
};
// const method =  core.getInput('METHOD') as keyof typeof methodObject;
const method = 'READ';
const isMethodExist = methodObject.hasOwnProperty(method);
if (!isMethodExist) {
    core.setFailed('Invalid method');
}
else {
    methodObject[method]();
}
