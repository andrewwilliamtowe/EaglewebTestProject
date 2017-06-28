//TreasurerRunForm.js
describe('Colorado Treasurer Make Online Payment', function() {
      beforeEach(function() {
	  browser.ignoreSynchronization = true;
	});

    function Left(str, n){
	    if (n <= 0) return "";
        else if (n > String(str).length) return "";
	    else return String(str).substring(n,String(str).length);
    };


    it('should have a title', function() {
        browser.get('http://lkwtaxapp1:8082/COBranchTre/web/');
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
        var login = browser.findElement(by.css('#middle_left input[value=Login'));
        expect(browser.getTitle()).toEqual('Login');
        login.click();
    });


    it('should run a search', function() {
        var searchParams = 'R001048'
        var accountNumber = browser.findElement(by.css('#AccountId'));
        var search = browser.findElement(by.css('.buttons:nth-child(1) td:nth-child(1) input'));
        expect(browser.getTitle()).toEqual('Tax Account Search');
        accountNumber.sendKeys(searchParams);
        console.log('Searching for: ' + searchParams);
        search.click();
    });


    //variable for count to loop through page so we can find accounts with a balance
    var resultsPerPage;
    var numberOfPages = 1;
    it('should have search results', function(){
        var title = browser.findElement(by.css('#middle h1'));
        var resultsCount = browser.findElement(by.css('.pagebanner:nth-child(5)'));
        var firstResult = browser.findElement(by.css('.odd:nth-child(1) strong a'));
        var lastPageCss = '.pagelinks:nth-child(6) a:last-child';
        var lastPageNumberCss = '.pagelinks:nth-child(6) strong'
        browser.isElementPresent(by.css(lastPageCss)).then(function(testTrue){
            if (testTrue == true){
                var lastPage = browser.findElement(by.css(lastPageCss));
                lastPage.click();
                browser.driver.findElement(by.css(lastPageNumberCss)).getText().then(function(pages){
                    numberOfPages = pages;
                    console.log('Number of Pages: '+pages);
                });
            browser.navigate().back();
            };
        });
        browser.findElements(by.css('strong a')).then(function(numberOfResults){
            resultsPerPage = numberOfResults.length;
        });
        expect(title.getText()).toEqual('Search Result');
        resultsCount.getText().then(function(countOfResults){
            console.log('Found Search Results: '+ countOfResults);
        });
        firstResult.click();      
     });

     // This loop needs a lot of work, it seems to work inside of the function in the inner loop
     // however, it just repeats the variable value before entering the loop on everything else.
     // I seem to be just passing a promise, rather than a new variable value, so it doesn't actually find an account
    var passed;
    var totalDue;
    var pageCount = 1;
    var maxPagesToSearch = 1;
    var count = 1;
    var totalAmountDue;
    it('get total due', function(){
        totalDue = browser.findElement(by.css('div#totals tr.hasLabel:last-child td[align="right"]'));
        expect(browser.getTitle()).toEqual('Tax Account');
        totalDue.getText().then(function(amtDue){
            totalAmountDue = Number(parseFloat(Left(amtDue,1).replace(',','')));
        });
    });

    it('loop through accounts', function(){
        while(((pageCount <= maxPagesToSearch)&&(pageCount <= numberOfPages)&&(totalAmountDue > 10))
        ||((pageCount <= maxPagesToSearch)&&(pageCount <= numberOfPages)&&(totalAmountDue <= 0))) {
            console.log('Searching page: '+pageCount);
            while(((totalAmountDue > 10)&&(count < resultsPerPage))||((count < resultsPerPage)&&(totalAmountDue <= 0))) {
               browser.navigate().back();
               browser.sleep(1000);
               count += 1;

               if (count == 2){cssPath = '.even:nth-child(2) strong a' }
               else {cssPath = 'tr:nth-child('+count+') strong a' };

               browser.findElement(by.css(cssPath)).click();
               totalDue = browser.findElement(by.css('div#totals tr.hasLabel:last-child td[align="right"]'));
               totalDue.getText().then(function(amtDue){
                    totalAmountDue = Number(parseFloat(Left(amtDue,1).replace(',','')));
                });
            };

            count = 1;
            pageCount += 1

            if (totalAmountDue < 10 && totalAmountDue > 0){
                var fullPayment = browser.driver.findElement(by.css('#paymentLinks tr+ tr td:nth-child(1) a'));
                var accountNumber = browser.driver.findElement(by.css('#taxAccountSummary .hasLabel:nth-child(1) .label+ td'));
                passed = true;
                accountNumber.getText().then(function(print){
                    console.log('Found Account: '+print+' With $'+totalAmountDue+' due');
                });
                fullPayment.click();
            }
            else if (pageCount < numberOfPages){
                browser.navigate().back();
                browser.findElement(by.css('.pagelinks:nth-child(6) a[title="Go to page '+pageCount+'"]')).click();
                browser.sleep(1000);
                browser.findElement(by.css('.odd:nth-child(1) strong a')).click();
                console.log('Going to next page');
            }
            else {console.log('No accounts with a suitable balance found');
            };
        };      
    },900000);

    it('should open up a webpayment', function(){

        if (passed != true && totalAmountDue < 10 && totalAmountDue > 0){
                var fullPayment = browser.driver.findElement(by.css('#paymentLinks tr+ tr td:nth-child(1) a'));
                var accountNumber = browser.driver.findElement(by.css('#taxAccountSummary .hasLabel:nth-child(1) .label+ td'));
                accountNumber.getText().then(function(print){
                    console.log('Found Account: '+print+' With $'+totalAmountDue+' due');
                });
                fullPayment.click();
        }
        else {return false;};
    });

    it('should checkout', function(){
        var checkout = browser.findElement(by.css('input'));
        checkout.click();
    });

    it('should enter payment method', function(){
        //need to have something here that selects the correct tender, but for now it defaults to the correct one
        var continueButton = browser.findElement(by.css('input'));
        continueButton.click();
    });

    it('should confirm checkout', function(){
        var continueButton = browser.findElement(by.css('br+ input'));
        var emailField = browser.findElement(by.css('#emailAddress input'));
        var email = 'thomas.lees@tylertech.com'
        console.log('Entering '+email+' as email for receipt');
        emailField.sendKeys(email);
        continueButton.click();
    });
});

