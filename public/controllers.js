angular.module("ContactListApp")
	.controller("mainCtrl", function($scope,$http){
		$scope.username = "";
		$scope.isAuth = false;
		$scope.persons = [];
		$scope.editing = false;
		$scope.contact = {};
		$scope.usr = {};
		$scope.dataUrl = "http://ec2-54-149-202-99.us-west-2.compute.amazonaws.com";
		console.log(angular.equals($scope.contact,{}));

		$http.get($scope.dataUrl + ":8080/contactlist/login")
			.success(function(data){
				$scope.isAuth = data.isAuthenticated;
			})

		$scope.login = function(){
			$http.post($scope.dataUrl + ":8080/contactlist/login",$scope.usr)
				.success(function(data){
					$scope.isAuth = data.isAuthenticated;
					$scope.username = data.user.name;
					console.log($scope.username);
				});
		};

		$scope.logout = function(){
			$http.get($scope.dataUrl + ":8080/contactlist/logout")
				.success(function(data){
					$scope.isAuth = data.isAuthenticated;
				});
		};

		$scope.loadData = function(){
			$http.get($scope.dataUrl + ":8080/contactlist").success(function(data){
				$scope.persons = data;
			});
		};	

		$scope.clear = function(){
			$scope.contact = {};
			$scope.editing = false;
		};	

		$scope.addContact = function(){
			if(angular.equals($scope.contact,{}))
					return console.log('empty');
			console.log('Adding : ' + $scope.contact.name);
			$http.post($scope.dataUrl + ":8080/contactlist",$scope.contact).
				success(function(data){
					$scope.persons.push(data);
					$scope.contact = {};
				});
		};

		$scope.removeContact = function(id){
			if(!confirm('Are you sure you want to delete?')){
				return false;
			}
				$http({
					method: 'DELETE',
					url: $scope.dataUrl + ":8080/contactlist/" + id
				}).success(function(data){
					for (var i = 0; i < $scope.persons.length; i++) {
						if($scope.persons[i]._id == id){
							$scope.persons.splice(i,1);
							$scope.contact = {};
						}
					};
					console.log('Deleted');
				})

			console.log($scope.dataUrl + ":8080/contactlist/" + id);
		};

		$scope.startEditContact = function(id){
				$scope.editing = true;
				for (var i = 0; i < $scope.persons.length; i++) {
					if($scope.persons[i]._id == id)
						$scope.contact = $scope.persons[i];
				}
		};

		$scope.editContact = function(){
				if(angular.equals($scope.contact,{}))
					return console.log('empty');
				$http({
					method: 'PUT',
					url: $scope.dataUrl + ":8080/contactlist/" + $scope.contact._id,
					data: $scope.contact
				}).success(function(data){
					for (var i = 0; i < $scope.persons.length; i++) {
						if($scope.persons[i]._id == data._id){
							$scope.persons[i] = data;
							$scope.contact = {};
						}
					};
					console.log('Updated');
					$scope.editing = false;
				})			
		};
	});
