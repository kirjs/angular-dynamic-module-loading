import { AngularDynamicModuleLoadingPage } from './app.po';

describe('angular-dynamic-module-loading App', () => {
  let page: AngularDynamicModuleLoadingPage;

  beforeEach(() => {
    page = new AngularDynamicModuleLoadingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
