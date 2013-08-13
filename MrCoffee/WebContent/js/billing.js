function Billing(){
	 var self = this;

	    // Initialisation
	    var initialize = function(data) {

		    // Not editable data
		    self.id = ko.id(self, data.id);
		    self.sumToPay=ko.sumToPay(self,data.sumToPay);
		    // Editable data
		    self.year = ko.observable(data.year);
		    self.month = ko.observable(data.month);
		    self.nrOfPads = ko.observable(data.nrOfPads);

	    self.sum = ko.computed(function() { //sum to pay
	    	return self.nrOfPads()*0.5; //nr of pads * cost of one pad
	    });
	    Consumer();
	 };
	 function BillingViewModel() {
		    var self = this;

		    // Editable data
		    self.consumers = ko.observableArray([]);

		    // Modification detection
		    self.state = new ko.objectStateArray(self.consumers);

		    self.saveCredit = function() {

		    	//send the newly created customers
		    	//self.state.created.reloadItems();
		    	var allData = self.state.created.items();

				var mappedItems = JSON.stringify(
					$.map(allData, function(data) {
			        	return {"forename": data.forename,
			        			"surname": data.surname,
			        			"credit": data.credit};
			    }));

				var mergeData = function(receivedData) {

			        var mergedConsumers = $.map(self.consumers(), function(consumer) {

			        	var receivedConsumer = (new Consumer()).createDefault();

			        	//check if we received data for a consumer
			        	var match = ko.utils.arrayFirst(receivedData, function (data) {
			        		receivedConsumer = data;
			        		return consumer.forename() == receivedConsumer.forename &&
			        		       consumer.surname() == receivedConsumer.surname;
			        	});

			        	//if a match was detected then merge the data
			        	if (match) {
			        		return (new Consumer()).createFromJSON(receivedConsumer);
			        	}

			        	return consumer;

			        });

			        self.consumers(mergedConsumers);
				};

		    	$.ajax({
		    		  type: 		"POST",
		    		  url: 			"rest/consumer",
		    		  contentType: 	"application/json",
		    		  data: 		mappedItems,
		    		  dataType: 	"json",
		    		  success: 		mergeData
		    	});

		    	//send the modified customers
		    	//self.state.modified.reloadItems();
		    	var allData = self.state.modified.items();

				var mappedItems = JSON.stringify(
					$.map(allData, function(data) {
			        	return {"id": data.id,
			        			"forename": data.forename,
			        			"surname": data.surname,
			        			"credit": data.credit};
			    }));

		    	$.ajax({
		    		  type: 		"PUT",
		    		  url: 			"rest/consumer",
		    		  contentType: 	"application/json",
		    		  data: 		mappedItems,
		    		  dataType: 	"json",
		    		  success: 		mergeData
		    	});

		    	//send the deleted customers
		    	//self.state.deleted.reloadItems();
		    	var allData = self.state.deleted.items();

		    	var mappedItems = JSON.stringify(
					$.map(allData, function(data) {
			        	return {"id": data.id,
			        			"forename": data.forename,
			        			"surname": data.surname,
			        			"credit": data.credit};
			    }));

		    	var mergeData = function() {
					  self.state.deleted.clearItems();
				};

		    };

		    //Validation operations
		    self.enableAdd = ko.computed(function() {
		    	return self.state.empty.hasNoItems();
		    });

		    self.enableSave = ko.computed(function() {
		    	return (self.state.created.hasItems() && self.state.empty.hasNoItems()) ||
		    	 	   self.state.modified.hasItems() ||
		    		   self.state.deleted.hasItems();
		    });

		    // Load initial state from server,
		    // convert it to Consumer instances,
		    // then populate self.consumers
		    $.ajax({
		    	type:		"GET",
		    	url:		"rest/consumer",
		    	dataType: 	"json",
		    	success:	function(allData) {

		            var mappedConsumers = $.map(allData, function(data) {
		            	return (new Consumer()).createFromJSON(data);
		            });

		            self.consumers(mappedConsumers);
		        }
		    });

		}
		//Initialize the binding
		ko.applyBindings(new BillingViewModel());
}