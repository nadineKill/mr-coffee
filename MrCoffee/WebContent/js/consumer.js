// Class to represent a row in the table
function Consumer(data) {
    var self = this;

    // Not editable data
    self.id = ko.id(self, data.id);

    // Editable data
    self.forename = ko.observable(data.forename);
    self.surname = ko.observable(data.surname);

    // Modification detection
    self.state = new ko.objectState({
		target 				: self,
		isInitiallyDirty 	: false,
		isInitiallyNew 		: data.isNew,
		checkEmptyFunction 	: function() {
			return (self.forename().length == 0) || (self.surname().length == 0);
		}
    });

}

// Overall view-model for this screen, along with initial state
function ConsumersViewModel() {
    var self = this;

    // Editable data
    self.consumers = ko.observableArray([]);

    // Modification detection
    self.state = new ko.objectStateArray(self.consumers);

    // Operations
    self.addConsumer = function() {
    	var newConsumer = new Consumer({id : "", forename : "", surname : "", isNew : true});
        self.consumers.push(newConsumer);
    };

    self.removeConsumer = function(consumer) {
    	if (consumer.state.newFlag.isNew()) {
    		self.consumers.remove(consumer);
    	} else {
    		self.consumers.destroy(consumer);
    	}
    };

    self.saveConsumers = function() {
    	//TODO
    };

    //Validation operations
    self.isValid = ko.computed(function() {
    	return self.state.hasDirtyItems() && self.state.hasNoEmptyItems();
    });

    // Load initial state from server,
    // convert it to Consumer instances,
    // then populate self.consumers
    $.getJSON("rest/consumer", function(allData) {

        var mappedConsumers = $.map(allData, function(data) {
        	return new Consumer(data);
        });

        self.consumers(mappedConsumers);
    });

}

//Initialize the binding
ko.applyBindings(new ConsumersViewModel());
