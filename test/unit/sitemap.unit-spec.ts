import {SitemapMother} from "../fixture/sitemap.mother";
import {MetadataMother} from "../fixture/metadata.mother";
import {Metadata} from "../../src/domain/metadata";

describe('Sitemap Unit Test', () => {
	it('Sitemap를 Metadata의 정보를 통해 업데이트한다.', async () => {
		// given
		const metadata = Metadata.fromString(MetadataMother.createMetadata(2, 1));
		const sitemap = SitemapMother.createByMetadata(metadata);
		const sitemapWithTranslated = SitemapMother.createByMetadata(metadata, false);

		// when
		sitemap.update(metadata);

		// then
		expect(sitemap.urls).toBe(sitemapWithTranslated.urls);

	})
})
