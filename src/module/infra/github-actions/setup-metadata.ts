import { Metadata } from "@src/module/domain/metadata";
import { githubFileReader, githubFileUploader } from "@src/module/implemention";
import { MetadataYamlParser } from "@src/module/parser/metadata-yaml.parser";
import { actionLogger } from "@src/module/repository";

export async function setupMetadata() {
	const metadata = await githubFileReader.findMetadata();
	if (metadata) return;
	actionLogger.info("Metadata not found, creating a new one.");
	const metadataFile = Buffer.from(MetadataYamlParser.parseToYaml(Metadata.createEmpty()));
	await githubFileUploader.uploadFile({
		path: Metadata.PATH,
		content: metadataFile,
	});
}
