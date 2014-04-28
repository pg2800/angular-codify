angular.module('CustomDirectives', ["ngRoute"])
.directive('cdCode', [function () {
	var cdCodeRegExp = /\s?(?:(?:data|x)[-:_])?cd[-:_]code\s*?=\s*?".*?"/i
	,lastTabs = /(\t*)(.+?)$/;

	return {
		priority: 0
		,restrict: 'A'
		,scope: false
		,compile: function compile(tElement, tAttrs) {
			var init = tElement[0].outerHTML.replace(cdCodeRegExp,'')
			,identedTabs = init.match(lastTabs) // We match for the tabs of last closing tag in the string
			,identedTabsRegExp; // We need to remove as many tabs as needed to have the code display properly

			// If the last closing tag had tabs at the beginning
			// We count them and create a regular expresion to remove them in every line.
			if(identedTabs && identedTabs.length>1) 
				identedTabsRegExp = new RegExp("^\t{"+identedTabs[1].length+"}","mg");

			// Remove tabs from initial code:
			identedTabsRegExp && (init = init.replace(identedTabsRegExp, ''));

			return function link($scope, iElement, iAttrs) {
				if(!iAttrs.cdCode) return;
				var options = iAttrs.cdCode.split(':')
				,element = identedTabsRegExp? iElement[0].outerHTML.replace(identedTabsRegExp,'') : iElement[0].outerHTML;

				iAttrs.cdCode = options[0];
				iAttrs.flag = options[1];

				var scopes = {
					inParent: $scope.$parent // Parent Scope
					,inScope: $scope // Current Scope
					,inActual: iAttrs.flag === "inActual" && (function($scope, prop){
						do {
							if($scope.hasOwnProperty(prop) || !$scope.$parent) return $scope;
							$scope = $scope.$parent;
						} while($scope);
					})($scope, iAttrs.cdCode) // Existing Variable within the Scope or any Parent
				}
				,selectedScope;

				selectedScope = scopes[iAttrs.flag] || scopes.inScope;
				selectedScope[iAttrs.cdCode] = {code: element.replace(cdCodeRegExp,''), compiled: init};
			}
		}
	};
}]);