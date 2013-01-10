// Dirty Flag
ko.dirtyFlag = function(root, isInitiallyDirty) {
    var result = function() {};

    var _initialState = ko.observable(ko.toJSON(root));
    var _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.computed(function() {
        return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
    });

    result.reset = function() {
        _initialState(ko.toJSON(root));
        _isInitiallyDirty(false);
    };

    return result;
};

// Empty Flag
ko.emptyFlag = function(checkEmptyFunction) {
	var result = function() {};

	result.isEmpty = ko.computed(function() {
		return checkEmptyFunction();
	});

	return result;
};

// New Flag
ko.newFlag = function(root, isInitiallyNew) {
	var result = function() {};

    if (isInitiallyNew) {
    	root._new = true;
    }

    result.isNew = function() {
    	return root._new != "" ? root._new : false;
    };

    return result;
};

// Extender for observable to log changes to the console
ko.extenders.logChange = function(target, option) {
    target.subscribe(function(newValue) {
       console.log(option + ": " + newValue);
    });
    return target;
};


// Class to represent a row in the table
function Consumer(data, isNew) {
    var self = this;

    // Not editable data
    if (data.id != "") {
    	self.id = data.id;
    }

    // Editable data
    self.forename = ko.observable(data.forename);
    self.surname = ko.observable(data.surname);

    // Modification detection
    self.newFlag = new ko.newFlag(this, isNew);

    self.emptyFlag = new ko.emptyFlag(function() {
    	return (self.forename().length == 0) || (self.surname().length == 0);
    });

    self.dirtyFlag = new ko.dirtyFlag(this);
}

// Overall view-model for this screen, along with initial state
function ConsumersViewModel() {
    var self = this;

    // Editable data
    self.consumers = ko.observableArray([]);

    // Operations
    self.addConsumer = function() {
    	var newConsumer = new Consumer({id:"", forename:"", surname:""}, true);
        self.consumers.push(newConsumer);
    };

    self.removeConsumer = function(consumer) {
    	if (consumer.newFlag.isNew()) {
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
            return consumer.dirtyFlag.isDirty();
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
	            return consumer.dirtyFlag.isDirty() && !consumer.newFlag.isNew();
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
            return consumer.emptyFlag.isEmpty();
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
