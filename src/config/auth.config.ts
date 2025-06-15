import { getInput } from "@actions/core";
import { isProduction } from "./index";

function getInputOrEnv(key: string, required = false): string {
	return isProduction ? getInput(key, { required }) : process.env[key] || "";
}

export const authConfig = {
	GH_REPOSITORY: getInputOrEnv("GH_REPOSITORY", true),
	GH_TOKEN: getInputOrEnv("GH_TOKEN", true),
	GH_USER: getInputOrEnv("GH_USER", true),
	OPENAI_API_KEY: getInputOrEnv("OPENAI_API_KEY", true),
	QIITA_TOKEN: getInputOrEnv("QIITA_TOKEN"),
};
