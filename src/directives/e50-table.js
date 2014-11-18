angular.module('e50Table').directive('e50Table', function ($parse) {
  return {
    restrict: 'A',
    scope: true,
    controller: function($scope) {
      this.$scope = $scope;
    },
    compile: function(tElement, tAttrs) {

      // Create ng-repeat on the e50-table-row
      var row = tElement[0].querySelector('[e50-table-row]');
      var rpt = document.createAttribute('ng-repeat');
      var key = tAttrs.e50DataKey ? tAttrs.e50DataKey : 't';
      rpt.value = key + ' in e50GetData() | orderBy : e50Sort : e50SortReverse | filter : e50Filter';
      row.attributes.setNamedItem(rpt);

      return function(scope, element, attrs) {
        // Create filtering function
        scope.e50Filter = function(d) {
          if ('e50Filter' in attrs) {
            return $parse(attrs.e50Filter)(scope)(d);
          } 
          return true;
        };

        // Observe sorting attributes for interpolated changes
        attrs.$observe('e50Sort', function(v) {
          scope.e50Sort = v;
        });
        attrs.$observe('e50SortReverse', function(v) {
          scope.e50SortReverse = v;
        });

        // If using an external data array
        if ('e50Data' in attrs) {
          scope.e50GetData = function() {
            return $parse(attrs.e50Data)(scope);
          };
          scope.e50SetData = function(data) {
            $parse(attrs.e50Data).assign(scope.$parent, data);
          };

        // If maintaining all data locally
        } else {
          var localData = [];
          scope.e50GetData = function() {
            return localData;
          };
          scope.e50SetData = function(data) {
            localData = data;
          };
        }

      };
    }
  };
});
