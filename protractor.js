describe('Annies Ancestors e2e', function() {

// test of login

  beforeEach(function() {
    	browser.get('http://localhost/');
  });

  var email = element(by.model('vm.email'));
  var password = element(by.model('vm.password'));
  var submit = element(by.id('submit'));

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual("Annie's Ancestors'");
  });
  
  it('it should login', function() {
	    element(by.model('email')).sendKeys('fweber@utk.edu');
	    element(by.model('email')).sendKeys('a');	
	    element(by.id('submit')).click();
  });
});