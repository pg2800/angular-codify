describe("Codify Custom Directive", function() {
	it("should find the module", function() {
		var $injector = angular.injector(['codify']);
		expect($injector).toBeDefined();
	});

	beforeEach(module("codify"));

	describe("codify-in Directive", function() {
		var $compile, $scope, $rootScope;

		beforeEach(inject(function (_$compile_, _$rootScope_){
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$scope = $rootScope.$new();
		}));

		it("should find the directive", inject(function(_codifyInDirective_) {
			expect(_codifyInDirective_).toBeDefined();
		}));

		it("should compile", function() {
			expect($compile('<div data-codify-in="testDiv:inScope"></div>')).not.toBeFalsy();
			expect($compile('<div data-cd-code="testDiv:inParent"></div>')).not.toBeFalsy();
			expect($compile('<div data:codify-in="testDiv:inActual"></div>')).not.toBeFalsy();

			expect($compile('<div data-codify-in="testDiv:inScope"></div>')($rootScope.$new())[0].nodeName).toBe("DIV");
			expect($compile('<div data-cd-code="testDiv:inParent"></div>')($rootScope.$new())[0].nodeName).toBe("DIV");
			expect($compile('<div data:codify-in="testDiv:inActual"></div>')($rootScope.$new())[0].nodeName).toBe("DIV");
		});

		describe("Scopes hierarchy", function() {
			var actualAncestor, parentScope, thisScope;

			beforeEach(inject(function (){
				actualAncestor = $scope.$new();
				parentScope = actualAncestor.$new();
				thisScope = parentScope.$new();
				$rootScope.testDiv = actualAncestor.testDiv = null;
			}));

			it("should declare the object in the CURRENT scope", function() {
				$compile('<div data-codify-in="testDiv:inScope"></div>')(thisScope);

				expect(thisScope.hasOwnProperty("testDiv")).toBeTruthy();
				expect(parentScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(actualAncestor.testDiv).toBeNull();
				expect($rootScope.testDiv).toBeNull();
			});

			it("should declare the object in the PARENT scope", function() {
				$compile('<div data-codify-in="testDiv:inParent"></div>')(thisScope);

				expect(thisScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(parentScope.hasOwnProperty("testDiv")).toBeTruthy();
				expect(actualAncestor.testDiv).toBeNull();
				expect($rootScope.testDiv).toBeNull();
			});

			it("should declare the object in the ANCESTOR scope", function() {
				$compile('<div data-codify-in="testDiv:inActual"></div>')(thisScope);

				expect(thisScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(parentScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(actualAncestor.testDiv).not.toBeNull();
				expect($rootScope.testDiv).toBeNull();
			});

			it("should declare the object in the OUTERMOST scope", function() {
				delete actualAncestor.testDiv;
				$compile('<div data-codify-in="testDiv:inActual"></div>')(thisScope);

				expect(thisScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(parentScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(actualAncestor.hasOwnProperty("testDiv")).toBeFalsy();
				expect($rootScope.testDiv).not.toBeNull();
			});

			it("should declare the object in the $rootScope", function() {
				delete actualAncestor.testDiv;
				$compile('<div data-codify-in="testDiv:inRoot"></div>')(thisScope);

				expect(thisScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(parentScope.hasOwnProperty("testDiv")).toBeFalsy();
				expect(actualAncestor.hasOwnProperty("testDiv")).toBeFalsy();
				expect($rootScope.testDiv).not.toBeNull();
			});
		});

		//
		it("should create an object in the scope", function() {
			var element = $compile('<div data-codify-in="obj:inScope"></div>')($scope);
			expect($scope.obj).toBeDefined();
		});
		it("found the object content correct", inject(function($timeout) {
			var element = $compile('<div data-codify-in="obj:inScope"></div>')($scope)
			,obj = $scope.obj;

			$timeout.flush();

			expect(obj.code).toBeDefined();
			expect(obj.compiled).toBeDefined();

			expect(obj.compiled).toBe('<div></div>');
			expect(obj.code).toBe('<div class="ng-scope"></div>');
		}));
	});
});