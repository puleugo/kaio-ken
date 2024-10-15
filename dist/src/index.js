import * as core from '@actions/core';
import { app } from "./app.js";
import { envValidator } from "./util/validator/env-validator";
envValidator.putOrThrow('GH_REPOSITORY', core.getInput('GH_REPOSITORY'));
envValidator.putOrThrow('GH_TOKEN', core.getInput('GH_TOKEN'));
envValidator.putOrThrow('GH_OWNER', core.getInput('GH_OWNER'));
envValidator.putOrThrow('SPREAD_SHEET_ID', core.getInput('SPREAD_SHEET_ID'));
envValidator.putOrThrow('GOOGLE_CLIENT_EMAIL', core.getInput('GOOGLE_CLIENT_EMAIL'));
envValidator.putOrThrow('GOOGLE_PRIVATE_KEY', core.getInput('GOOGLE_PRIVATE_KEY'));
const methodObject = {
    'READ': () => app.generateOriginalPost(),
    'PUBLISH': () => new Promise(resolve => resolve()),
    'UPDATE_SPREAD_SHEET': () => app.updateSpreadSheetSettings(),
};
const method = core.getInput('METHOD');
const isMethodExist = methodObject.hasOwnProperty(method);
if (!isMethodExist) {
    core.setFailed(`올바르지 않은 METHOD입니다. ${Object.keys(methodObject).join(', ')} 중 하나를 입력해주세요.`);
}
else {
    methodObject[method]();
}
