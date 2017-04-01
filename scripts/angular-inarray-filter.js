/**
 * Filtra los resultados contenidos en un array
 * @Author: Alejandro Carrasco W.
 *
 */

angular.module('filters-inArrayFilter', ['inArrayFilter']);

var inArrayFilter = angular.module('inArrayFilter', []);

inArrayFilter.filter('inArray', function($filter){
    return function(list, arrayFilter,element){
        if(arrayFilter){
            if (element){
                return $filter("filter")(list, function(listItem){
                    return arrayFilter.indexOf(listItem[element]) != -1;
                });
            } else{
                return $filter("filter")(list, function(listItem){
                    return arrayFilter.indexOf(listItem) != -1;
                });
            }
        }
    }
});