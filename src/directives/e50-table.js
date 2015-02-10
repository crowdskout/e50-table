angular.module('e50Table').directive('e50Table', function ($parse) {
  return {
    restrict: 'A',
    scope: true,
    controller: function($scope, $attrs) {
      this.$scope = $scope;
      this.$attrs = $attrs;
    },
    compile: function(tElement, tAttrs) {

      // Create ng-repeat on the e50-table-row
      var rows = tElement[0].querySelectorAll('[e50-table-row]');
      angular.forEach(rows, function(row) {
        var rpt = document.createAttribute('ng-repeat');
        var key = 'e50DataKey' in tAttrs ? tAttrs.e50DataKey : 't';
        var prop = 'e50DataProp' in tAttrs ? '.' + tAttrs.e50DataProp : '';
        rpt.value = key + ' in e50GetData()' + prop + ' | orderBy : e50Sort : e50SortReverse | filter : e50Filter';
        row.attributes.setNamedItem(rpt);
      });

      return function(scope, element, attrs) {
        scope.e50Deleted = [];

        // Create filtering function
        scope.e50Filter = function(d) {
          if (scope.e50Deleted.indexOf(d.id) >= 0) { return false; }
          if ('e50Filter' in attrs) {
            return $parse(attrs.e50Filter)(scope)(d);
          }
          return true;
        };

        // Create delete row function
        scope.e50DeleteRow = function(t) {
          scope.e50Deleted.push(t.id);
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
          scope.$on('$destroy', function() {
          });

        // If maintaining all data locally
        } else {
          var localData = [];
          scope.e50GetData = function() {
            return localData;
          };
          scope.e50SetData = function(data) {
            localData = data;
          };
          scope.$on('$destroy', function() {
          });
        }

      };
    }
  };
});
