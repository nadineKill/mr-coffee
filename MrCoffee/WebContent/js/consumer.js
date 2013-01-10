// Class to represent a row in the table
function Consumer(data) {
    var self = this;

    // Not editable data
    self.id = new ko.id(self, data.id);

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


    // Modification detection

    // Dirty items computation
    self.dirtyItems = ko.computed(function() {
    	self.lastDirtyItems = ko.utils.arrayFilter(self.consumers(), function(consumer) {
            return consumer.state.dirtyFlag.isDirty();
        });
    	return self.lastDirtyItems;
    }, self);

    self.hasDirtyItems = ko.computed(function() {
        return self.dirtyItems().length > 0;
    }, self);

    // Modified items computation
    self.reloadModified = ko.observable(false);

    self.modifiedItems = ko.computed(function() {
    	//will be only computed if the related reload flag is set
    	if (self.reloadModified()) {
	    	self.lastModifiedItems = ko.utils.arrayFilter(self.consumers(), function(consumer) {
	            return consumer.state.dirtyFlag.isDirty() && !consumer.state.newFlag.isNew();
	        });
	    	self.reloadModified(false);
    	}
    	return self.lastModifiedItems;
    }, self);

    self.hasDirtyItems = ko.computed(function() {
        return self.dirtyItems().length > 0;
    }, self);

    self.reloadModifiedConsumers = function() {
    	self.reloadModified(true);
    };

    // Empty items computation
    self.emptyItems = ko.computed(function() {
    	return ko.utils.arrayFilter(self.consumers(), function(consumer) {
            return consumer.state.emptyFlag.isEmpty();
        });
    }, self);

    self.hasNoEmptyItems = ko.computed(function() {
        return !(self.emptyItems().length > 0);
    }, self);


    //Validation operations
    self.isValid = ko.computed(function() {
    	return self.hasDirtyItems() && self.hasNoEmptyItems();
    }, self);


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
