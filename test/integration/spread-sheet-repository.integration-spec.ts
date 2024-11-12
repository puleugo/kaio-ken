import {SpreadSheetReader, SpreadSheetReaderInterface} from "../../src/implemention/spread-sheet.reader";
import {SpreadSheetRepositoryStub} from "../stub/spread-sheet-repository.stub";

describe('SpreadSheetRepository Integration Test', () => {
	let spreadSheetRepositoryStub: SpreadSheetRepositoryStub;
	let spreadSheetReader: SpreadSheetReaderInterface
	beforeAll(() => {
		spreadSheetRepositoryStub = new SpreadSheetRepositoryStub();
		spreadSheetReader = new SpreadSheetReader(spreadSheetRepositoryStub);
	})
	it('값을 반환한다.', async () => {
		await spreadSheetReader.readBlogs();

	})
	it.todo('스프레드 시트가 존재하지 않는다면 에러를 반환한다.')
	it.todo('존재하지 않는 시트명과 범위로 요청하면 에러를 반환한다.')
})
