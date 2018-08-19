import { AppPage } from './app.po';

describe('essence-3d App', () => {
	let appPage: AppPage;

	beforeAll(() => {
		appPage = new AppPage();
		appPage.navigateTo();
	});

	it('title should "基于Cesium的三维平台"', () => {
		expect(appPage.getAppTitle()).toEqual('基于Cesium的三维平台');
	});
});
