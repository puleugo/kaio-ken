import * as core from '@actions/core';
import {app} from "./app";
import {envManager} from "./util/config/env-manager";

if (process.env.NODE_ENV !== 'test') {
	envManager.putOrThrow('GH_REPOSITORY', core.getInput('GH_REPOSITORY', {required: true}));
	envManager.putOrThrow('GH_TOKEN', core.getInput('GH_TOKEN', {required: true}));
	envManager.putOrThrow('GH_USER', core.getInput('GH_USER', {required: true}));
	envManager.putOrThrow('GOOGLE_SHEET_ID', core.getInput('GOOGLE_SHEET_ID', {required: true}));
	envManager.putOrThrow('GOOGLE_CLIENT_EMAIL', core.getInput('GOOGLE_CLIENT_EMAIL', {required: true}));
	envManager.putOrThrow('GOOGLE_PRIVATE_KEY', core.getInput('GOOGLE_PRIVATE_KEY', {required: true}));

	envManager.put('MEDIUM_TOKEN', core.getInput('MEDIUM_TOKEN'));
	envManager.put('OPENAI_API_KEY', core.getInput('OPENAI_API_KEY'));
}

async function bootstrap() {
	const methodObject = {
		'READ': () => app.cloneOriginalPostsToGithub(),
		'PUBLISH': () => app.uploadPosts(),
		'UPDATE_SPREAD_SHEET': () =>app.updateSpreadSheetSettings(),
	}
	const methods =  core.getMultilineInput('METHOD', {required: true}).map(line => line.trim().replace(/^- /, '')) as Array<keyof typeof methodObject>
	core.debug(`methods: ${methods.join(', ')}`)

	methods.map(method => {
		if (!Object.keys(methodObject).includes(method))
			core.error(`${method}는 올바르지 않은 METHOD입니다. ${Object.keys(methodObject).join(', ')} 중 하나를 입력해주세요.`)
	});

	try {
		if (methods.includes('UPDATE_SPREAD_SHEET'))
			await methodObject.UPDATE_SPREAD_SHEET();

		if (methods.includes('READ'))
			await methodObject.READ();

		if (methods.includes('PUBLISH'))
			await methodObject.PUBLISH();

	} catch (e: unknown) {
		if (e instanceof Error) {
			core.error(e.message);
		} else if (typeof e === 'string') {
			core.error(e);
		}
		core.setFailed('알 수 없는 에러가 발생했습니다.');
	}
}

bootstrap();
