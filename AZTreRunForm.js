//TreasurerRunForm.js
describe('Arizona Treasurer Run Eagleweb Form', function() {
      beforeEach(function() {
	  browser.ignoreSynchronization = true;
	});

    it('should have a title', function() {
        browser.get('http://lkwtaxapp2:8086/LaPazAZTreBranch/web');
        expect(browser.getTitle()).toEqual('Enter EagleWeb');
        browser.getTitle().then(function(SiteTitle){
            console.log('Site Title: ' + SiteTitle);
        });
    });

    it("click 'read the above statement'", function() {
        var input = browser.findElement(by.css('input'));
        input.getAttribute('value').then(function(InputText){
            console.log('Clicking: ' + '"' + InputText+ '"');
        });
        input.click();
    });

    it('should login as public', function() {
        var login = browser.findElement(by.css('#middle_left input[value=Login]'));
        expect(browser.getTitle()).toEqual('Login');
        login.click();
    });

    it('should run a search', function() {
        var searchParams = 'R*'
        var accountNumber = browser.findElement(by.css('#TaxAccountID'));
        var search = browser.findElement(by.css('.buttons:nth-child(1) td:nth-child(1) input'));
        expect(browser.getTitle()).toEqual('Tax Account Search');
        accountNumber.sendKeys(searchParams);
        console.log('Searching for: ' + searchParams);
        search.click();
    });

    it('should have search results', function(){
        var title = browser.findElement(by.css('#middle h1'));
        var resultsCount = browser.findElement(by.css('.pagebanner:nth-child(3)'));
        var firstResult = browser.findElement(by.css('.odd:nth-child(1) strong a'));
        expect(title.getText()).toEqual('Search Results');
        resultsCount.getText().then(function(countOfResults){
            console.log('Found Search Results: '+ countOfResults);
        });
        firstResult.getText().then(function(firstAccount){
            console.log('Opening: '+ firstAccount);
        });
        firstResult.click();
     });

    var form;
    it('should have an account open', function(){
        var accountId = browser.findElement(by.css('#taxAccountSummary .hasLabel:nth-child(1) .label+ td'));
        var formToRun = browser.findElement(by.css('h1+ .widget h1+ a'));
        expect(browser.getTitle()).toEqual('Tax Account');
        accountId.getText().then(function(account){
            console.log('Account Open: '+ account);
        });
        formToRun.getText().then(function(formName){
            console.log('Running Form: ' + formName);
            form = formName;
        });
        formToRun.click();
    });

    it('should have run a form', function(){
        browser.sleep(5000);
        //I'll figure this out later, but the line below should select by css for the form name collected in the last screen
        //Currently, it can't find that element :/
        //var formRan = browser.findElement(by.css('#myReports tr a[title='+'"'+form+'"'+']'));
        var formRan = browser.findElement(by.css('#myReports tr:nth-child(2) a'));
        expect(formRan.getText()).toEqual(form);
        formRan.getText().then(function(printName){
            console.log('Report Ran: '+ printName);
        });
    });

});
