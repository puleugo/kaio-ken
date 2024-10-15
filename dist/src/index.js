import * as core from '@actions/core';
import { app } from "./app.js";
const methodObject = {
    'READ': () => app.generateOriginalPost(),
    'PUBLISH': () => new Promise(resolve => resolve()),
    'UPDATE_SPREAD_SHEEt': () => app.updateSpreadSheetSettings(),
};
const method = core.getInput('METHOD');
const isMethodExist = methodObject.hasOwnProperty(method);
if (!isMethodExist) {
    core.setFailed(`올바르지 않은 METHOD입니다. ${Object.keys(methodObject).join(', ')} 중 하나를 입력해주세요.`);
}
else {
    methodObject[method]();
}
