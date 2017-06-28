// conf.js
exports.config = {
  specs:[],
  multiCapabilities: [
    {'browserName': 'chrome', 'specs': ['AZTreMakeWebPayment.js']},
    {'browserName': 'chrome', 'specs': ['COTreMakeWebPayment.js']},
    {'browserName': 'chrome', 'specs': ['AZTreRunForm.js']}
    ],
  baseUrl: 'http://localhost:4444',
  framework: 'jasmine',
  jasmineNodeOpts: {defaultTimoutInterval: 30000},
  onPrepare: function(){
		browser.driver.manage().timeouts().implicitlyWait(5000);
  }
}
