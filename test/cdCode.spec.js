describe("Custom Directives", function() {
	it("should find the module", function() {
		var $injector = angular.injector(['CustomDirectives']);
		expect($injector).toBeDefined();
	});
	describe("cdCode Directive", function() {
		it("should behave...", function() {
			expect(true).toBeTruthy();
		});
	});
});