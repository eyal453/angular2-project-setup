describe('Protractor Demo App', function() {
    it('should have a title', function() { 
        browser.get('http://localhost:3000/m1');
        expect(browser.getTitle()).toEqual('my app');
    });
});