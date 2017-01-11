//Angular Starter App
var main = angular.module("main", ['ui.router','ngRoute','ngResource','ui.bootstrap','vsGoogleAutocomplete','ngFileUpload'])
.run(function($http,$rootScope,$anchorScroll)
{
    
    //defining global veriables
    $rootScope.roles = [{
		  name: "Administrator",
          code: 0
	   }, {
		  name: "Staff",
          code: 1
	   }, {
		  name: "General",
          code: 2
	}];
    
    //roles enum for authorization
    // $rootScope.AuthenticRoles = {
    //   Administrator: "Administrator",
    //   Staff: "Staff",
    //   General: "General"
    // };
    // $rootScope.routeForUnauthorizedAccess = 'unauth';
    
    
    //Checking current session value
    window.onbeforeunload = function () {
        sessionStorage.clear();
    };
    window.onunload = function () {
        sessionStorage.clear();
    };
    if(sessionStorage.length > 0){
        $rootScope.current_user = sessionStorage.current_user;
        $rootScope.authenticated = true;
    }else{
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
        $rootScope.current_fullname = 'Guest';
    }
    
    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
        $rootScope.current_fullname = 'Guest';
        sessionStorage.clear();
        // window.location = '/';
    };
});

//Routing Configuration (define routes)
main.config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider,$rootScope) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'Contact.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
                //below code is for authentication
                // ,
                // resolve: {
                // permission: function(authorizationService, $rootScope) {
                //     return authorizationService.permissionCheck($rootScope.AuthenticRoles.Administrator);
                // }
                // }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'About.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('info', {
                url: '/info',
                templateUrl: 'info.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('login',{
                url: '/login',
                templateUrl: 'login.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('register',{
                url: '/register',
                templateUrl: 'register.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('unauth',{
                url: '/unauth',
                templateUrl: 'unauth.html',
                caseInsensitiveMatch: true
            })
            .state('CarrierResults',{
                url: '/CarrierResults',
                templateUrl: 'CarrierResults.html',
                caseInsensitiveMatch: true,
                controller: 'CarrierResultsController'
            })
            .state('BecomeCarrier',{
                url: '/BecomeCarrier',
                templateUrl: 'BecomeCarrier.html',
                caseInsensitiveMatch: true,
                controller: 'BecomeCarrierController'
            })
            // .state('profile',{
            //     url: '/profile',
            //     templateUrl: 'profile.html',
            //     caseInsensitiveMatch: true,
            //     controller: 'TestController'
            // });
    }
]);
main.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
main.directive('avatar',function(){
return{
        controller:"BecomeCarrierController",
        controllerAs:"user",
        restrict:"E",
        template:[
            '<div class="avatar--image-container">',
            '<img class="avatar--image" alt="{{user.data.first_name}} {{user.data.last_name}}" ng-src="{{avatar}}" title="{{user.data.first_name}} {{user.data.last_name}}" />',
            '<div class="avatar--radial-percentage" '," round-progress",' max="100" ',' current="user.progress.general" ',' color="{{user.progress.color}}" ',' bgcolor="#757575" ',' radius="88" ',' stroke="5" ',' duration="800" ',"  >",
            "</div>",
            '     <div class="avatar--overlay">',
            '       <ul class="social-links clearfix">',
            '         <li class="portrait__upload-button">',
            '           <input ngf-select="uploadFiles($file, $invalidFiles)" type="file" accept="image/*" ngf-max-size="2MB"/>',
            "           </input>",
            "         </li>",
            "       </ul>",
            "     </div>",
            "  </div>",
            '  <div class="avatar--percent-complete" style="background-color: {{user.progress.color}}" data-toggle="popover" data-content="{{user.completionMessage}}">',
            "    {{user.progress.general}}%",
            "  </div>"].join("")
    
    };
});
main.filter('ageFilter', function() {
     function calculateAge(birthday) { // birthday is a date
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function(birthdate) { 
           return calculateAge(birthdate);
     }; 
});
//below factory code is for authentication, User Current Session Need to Get and get to go
// main.factory('authorizationService', function ($resource, $q, $rootScope, $location) {
// return {
//         // We would cache the permission for the session,
//         //to avoid roundtrip to server
//         //for subsequent requests
//         permissionModel: {
//             permission: {},
//             isPermissionLoaded: false
//         },
//         
//         permissionCheck: function (roleCollection) {
//             // we will return a promise .
//             var deferred = $q.defer();
// 
//             //this is just to keep a pointer to parent scope from within promise scope.
//             var parentPointer = this;
//             
//             //Checking if permission object(list of roles for logged in user) 
//             //is already filled from service
//             if (this.permissionModel.isPermissionLoaded) {
//                 //Check if the current user has required role to access the route
//                 this.getPermission(this.permissionModel, roleCollection, deferred);
//             }else{
//                 //if permission is not obtained yet, we will get it from  server.
//                 // 'api/permissionService' is the path of server web service , used for this example.
// 
//                 $resource('/api/permissionService').get().$promise.then(function (response) {
//                     //when server service responds then we will fill the permission object
//                     parentPointer.permissionModel.permission = response;
// 
//                     //Indicator is set to true that permission object is filled and 
//                     //can be re-used for subsequent route request for the session of the user
//                     parentPointer.permissionModel.isPermissionLoaded = true;
// 
//                     //Check if the current user has required role to access the route
//                     parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
//                 });
//             }
//             return deferred.promise;
//         },
//         
//         //Method to check if the current user has required role to access the route
//         //'permissionModel' has permission information obtained from server for current user
//         //'roleCollection' is the list of roles which are authorized to access route
//         //'deferred' is the object through which we shall resolve promise
//         getPermission: function (permissionModel, roleCollection, deferred) {
//             var ifPermissionPassed = false;
//             switch (roleCollection) {
//                     case $rootScope.AuthenticRoles.Administrator:
//                         if (permissionModel.permission.isAdministrator) {
//                             ifPermissionPassed = true;
//                         }
//                         break;
//                     case $rootScope.AuthenticRoles.Staff:
//                         if (permissionModel.permission.isStaff) {
//                             ifPermissionPassed = true;
//                         }
//                         break;
//                     case $rootScope.AuthenticRoles.General:
//                         if (permissionModel.permission.isGeneral) {
//                             ifPermissionPassed = true;
//                         }
//                         break;
//                     default:
//                         ifPermissionPassed = false;
//             }
//             if (!ifPermissionPassed) {
//                 //If user does not have required access, 
//                 //we will route the user to unauthorized access page
//                 $location.path($rootScope.routeForUnauthorizedAccess);
//                 //As there could be some delay when location change event happens, 
//                 //we will keep a watch on $locationChangeSuccess event
//                 // and would resolve promise when this event occurs.
//                 $rootScope.$on('$locationChangeSuccess', function (next, current) {
//                     deferred.resolve();
//                 });
//             } else {
//                 deferred.resolve();
//             }
//         }
//     }
// });
