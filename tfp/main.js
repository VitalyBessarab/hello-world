var app = angular.module('app', ['ngMockE2E'/*, 'ui.router'*/]);
app.run(function($httpBackend) {
	var serverSearch = jsonDb;

	$httpBackend.whenGET('http://localhost:8080/search')
		.respond(function() {
			var inListResult = [];
			for (var i = 0; i < serverSearch.length; i++) {
				if(serverSearch[i]['inList'] == true) {
					inListResult.push(serverSearch[i]);
				}
			}
			return [200, inListResult];
		});
	$httpBackend.whenPOST('http://localhost:8080/search')
		.respond(function(method, url, data) {
			var foundSet = [];
			if(data == null || data == undefined || data == '')
			{
				return [200, foundSet];
			}
			else {
				var whatFind = data.toLowerCase();
				for (var i = 0; i < serverSearch.length; i++) {
					if(serverSearch[i]['okpo'] == null || serverSearch[i]['name'] == null)
						continue;
					var flag = serverSearch[i]['okpo'].indexOf(whatFind) > -1 ||
							   serverSearch[i]['name'].toLowerCase().indexOf(whatFind) > -1;
					if(flag) {
						foundSet.push(serverSearch[i]);
					}
				};
			}
			return [200, foundSet];
		});		
});

app.controller('mainCtrl', function($scope, $http) {
	$scope.cabinetList = [];
	$http.get('http://localhost:8080/search')
		.success(function(result) {
			$scope.cabinetList = result;
		})
		.error(function() {
			console.log('error');
		});
	
	$scope.isVisibleSearch = true;
	$scope.isVisibleCabinet = false;
	$scope.setSearchVisible = function() {
		if(!$scope.isVisibleSearch) {
			$scope.isVisibleSearch = true;
			$scope.isVisibleCabinet = false;
		}
	}
	$scope.setCabinetVisible = function() {
		if(!$scope.isVisibleCabinet) {
			$scope.isVisibleSearch = false;
			$scope.isVisibleCabinet = true;
		}
		$scope.whatFind = null;
		$scope.search = null;
	}

	$scope.getSearchSet = function(whatFind) {
		$http.post('http://localhost:8080/search', whatFind)
			.success(function(result) {
				$scope.search = result;
				$scope.record = null;
			})
			.error(function() {
				console.log('error');
			});
	};
	$scope.addToCabinet = function(recordId) {
		for(var i = 0; i < $scope.cabinetList.length; i++) {
			if($scope.cabinetList[i].id == recordId) {
				return;
			};
		}		
		for(i = 0; i < $scope.search.length; i++) {
			if($scope.search[i].id == recordId) {
				$scope.cabinetList.push($scope.search[i]);
				break;
			};
		};
	};
});
