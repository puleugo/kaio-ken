import * as core from '@actions/core';
import {app} from "./app.js";

const methodObject = {
	'READ': () => app.generateOriginalPost(),
	'PUBLISH': () => new Promise<void>(resolve => resolve()),
	'UPDATE_SPREAD_SHEET': () =>app.updateSpreadSheetSettings(),
}

const method =  core.getInput('METHOD') as keyof typeof methodObject;
const isMethodExist = methodObject.hasOwnProperty(method);

if (!isMethodExist) {
	core.setFailed(`올바르지 않은 METHOD입니다. ${Object.keys(methodObject).join(', ')} 중 하나를 입력해주세요.`);
} else {
	try {
		methodObject[method]();
	} catch (e: unknown) {
		if (e instanceof Error) {
			core.setFailed('알 수 없는 에러가 발생했습니다.');
		}
		else if(typeof e === 'string') {
			core.setFailed(e);
		} else {
			core.setFailed('알 수 없는 에러가 발생했습니다.');
		}
	}
}
