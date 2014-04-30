angular.module('CustomDirectives', ["ngRoute"])
.directive('cdCode', [function () {
	var cdCodeRegExp = /\s?(?:(?:data|x)[-:_])?cd[-:_]code\s*?=\s*?".*?"/i
	,lastTabs = /(\t*)(.+?)$/;

	return {
		priority: 0 // Default
		,restrict: 'A' // Only as Attribute
		,scope: false // Uses the current scope
		,compile: function compile(templateElement, templateAttrs) {
			var init = templateElement[0].outerHTML.replace(cdCodeRegExp,'')
			,identedTabs = init.match(lastTabs) // We match for the tabs of last closing tag in the string
			,identedTabsRegExp; // We need to remove as many tabs as needed to have the code display properly

			// If the last closing tag had tabs at the beginning
			// We count them and create a regular expresion to remove them in every line.
			if(identedTabs && identedTabs.length>1) 
				identedTabsRegExp = new RegExp("^\t{"+identedTabs[1].length+"}","mg");

			// Remove tabs from initial code:
			identedTabsRegExp && (init = init.replace(identedTabsRegExp, ''));

			return function link($scope, instanceElement, instanceAttrs) {
				if(!instanceAttrs.cdCode) return;
				var options = instanceAttrs.cdCode.split(':')
				,element = identedTabsRegExp? instanceElement[0].outerHTML.replace(identedTabsRegExp,'') : instanceElement[0].outerHTML;

				instanceAttrs.cdCode = options[0];
				instanceAttrs.flag = options[1];

				var scopes = {
					inParent: $scope.$parent // Parent Scope
					,inScope: $scope // Current Scope
					,inActual: instanceAttrs.flag === "inActual" && (function($scope, prop){
						do {
							if($scope.hasOwnProperty(prop) || !$scope.$parent) return $scope;
						} while($scope = $scope.$parent);
					})($scope, instanceAttrs.cdCode) // Existing Variable within the Scope or any Parent
					,inRoot: $scope.$root
				}
				,selectedScope;

				selectedScope = scopes[instanceAttrs.flag] || scopes.inScope;
				selectedScope[instanceAttrs.cdCode] = {code: element.replace(cdCodeRegExp,''), compiled: init};
			}
		}
	};
}]);