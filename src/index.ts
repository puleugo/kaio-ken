import * as core from '@actions/core';
import {app} from "./app";
import {envValidator} from "./util/config/env-manager";

if (process.env.NODE_ENV !== 'test') {
	envValidator.putOrThrow('GH_REPOSITORY', core.getInput('GH_REPOSITORY'));
	envValidator.putOrThrow('GH_TOKEN', core.getInput('GH_TOKEN'));
	envValidator.putOrThrow('GH_USER', core.getInput('GH_USER'));
	envValidator.putOrThrow('GOOGLE_SHEET_ID', core.getInput('GOOGLE_SHEET_ID'));
	envValidator.putOrThrow('GOOGLE_CLIENT_EMAIL', core.getInput('GOOGLE_CLIENT_EMAIL'));
	envValidator.putOrThrow('GOOGLE_PRIVATE_KEY', core.getInput('GOOGLE_PRIVATE_KEY'));
}

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
			core.error(e.message);
			core.setFailed('알 수 없는 에러가 발생했습니다.');
		}
		else if(typeof e === 'string') {
			core.error(e);
			core.setFailed('알 수 없는 에러가 발생했습니다.');
		} else {
			core.setFailed('알 수 없는 에러가 발생했습니다.');
		}
	}
}
