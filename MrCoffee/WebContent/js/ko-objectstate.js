/**
 * Object property for 'id', which will be set to the object
 * only when the 'id' value isn't undefined and empty to prevent
 * that the 'id' property will be serialized to JSON output.
 *
 * @constructor
 * @param {object} target The object which should be observed for state changes.
 * @param {integer} [id] The object id value.
 */
ko.id = function(target, id) {

    if ((id != undefined) && (id != "")) {
    	return id;
    }

};

/**
 * Object state manager - Dirty Flag.
 *
 * @constructor
 * @param {object} target The object which should be observed for state changes.
 * @param {boolean} isInitiallyDirty true if the passed object is already dirty (modified), otherwise false.
 */
ko.dirtyFlag = function(target, isInitiallyDirty) {
    var result = function() {};

    var _initialState = ko.observable(ko.toJSON(target));
    var _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.computed(function() {
        return _isInitiallyDirty() || _initialState() !== ko.toJSON(target);
    });

    result.reset = function() {
        _initialState(ko.toJSON(target));
        _isInitiallyDirty(false);
    };

    return result;
};

/**
 * Object state manager - Empty Flag.
 *
 * @constructor
 * @param {function} checkEmptyFunction A validation function to check if the object is empty.
 */
ko.emptyFlag = function(checkEmptyFunction) {
	var result = function() {};

	result.isEmpty = ko.computed(function() {
		if (checkEmptyFunction != undefined) {
			return checkEmptyFunction();
		} else {
			return false;
		}
	});

	return result;
};

/**
 * Object state manager - New Flag.
 *
 * @constructor {object} target The object which should be observed for state changes.
 * @param {boolean} isInitiallyNew true if the passed object is newly created, otherwise pass empty as value.
 */
ko.newFlag = function(target, isInitiallyNew) {
	var result = function() {};

    if (isInitiallyNew) {
    	target._new = true;
    }

    result.isNew = function() {
    	return target._new != "" ? target._new : false;
    };

    return result;
};

/**
 * Object state manager - Delete Flag.
 *
 * @constructor {object} target The object which should be observed for state changes.
 */
ko.deleteFlag = function(target) {
	var result = function() {};

	result.isDeleted = function() {
		return target._destroy != "" ? target._destroy : false;
	};

	return result;
};

/**
 * Object state manager.
 *
 * @constructor
 * @param {object} data The data to initialize the object state manager.
 * @param {object} data.target The object which should be observed for state changes.
 * @param {boolean} data.isInitiallyDirty true if the passed object is already dirty (modified), otherwise false.
 * @param {boolean} data.isInitiallyNew true if the passed object is newly created, otherwise pass empty as value.
 * @param {function} data.checkEmptyFunction A validation function to check if the object is empty.
 */
ko.objectState = function(data) {
	var stateResult = function() {};

	stateResult.dirtyFlag = new ko.dirtyFlag(data.target, data.isInitiallyDirty);
	stateResult.emptyFlag = new ko.emptyFlag(data.checkEmptyFunction);
	stateResult.newFlag = new ko.newFlag(data.target, data.isInitiallyNew);
	stateResult.deleteFlag = new ko.deleteFlag(data.target);

	stateResult.isDirty = function() {
		return stateResult.dirtyFlag.isDirty() && !stateResult.newFlag.isNew();
	};

	stateResult.isDeleted = function() {
		return stateResult.deleteFlag.isDeleted();
	};

	stateResult.isNew = function() {
		return stateResult.newFlag.isNew();
	};

	return stateResult;
};

/**
 * Object state manager for the related object array.
 *
 * @constructor
 * @param {array} target The object array which should be observed for state changes.
 */
ko.objectStateArray = function(target) {
	var stateResult = function() {};

	// All items
	stateResult.allItemsAsJSON = function(){
		return ko.toJSON(target);
	};

    // Empty items computation
    stateResult.emptyItems = ko.computed(function() {
    	return ko.utils.arrayFilter(target(), function(item) {
            return item.state.emptyFlag.isEmpty();
        });
    });

    stateResult.hasNoEmptyItems = ko.computed(function() {
        return !(stateResult.emptyItems().length > 0);
    });

    // Dirty items computation
	stateResult.lastDirtyItems = [];

	stateResult.dirtyItems = ko.computed(function() {
		stateResult.lastDirtyItems = ko.utils.arrayFilter(target(), function(item) {
            return item.state.dirtyFlag.isDirty();
        });
    	return stateResult.lastDirtyItems;
	});

	stateResult.dirtyItemsAsJSON = function() {
		return ko.toJSON(stateResult.dirtyItems);
	};

	stateResult.hasDirtyItems = ko.computed(function() {
        return stateResult.dirtyItems().length > 0;
    });

    // Created items computation
    stateResult.created = new ko.reloadableFilteredItems({
    	items			: target,
    	filterFunction	: function(item) {
    		return item.state.newFlag.isNew();
    	}
    });

    // Modified items computation
    stateResult.modified = new ko.reloadableFilteredItems({
    	items			: target,
    	filterFunction	: function(item) {
    		return item.state.dirtyFlag.isDirty() && !item.state.newFlag.isNew();
    	}
    });

    //Deleted items computation
    stateResult.deleted = new ko.reloadableFilteredItems({
    	items			: target,
    	filterFunction	: function(item) {
    		return item.state.deleteFlag.isDeleted();
    	}
    });

	return stateResult;
};

/**
 * Reloadable filtered items.
 *
 * @constructor
 * @param {object} data The data to initialize the computation object.
 * @param {object} data.items The items which should be observed for state changes.
 * @param {object} data.filterFunction A function to filter which items should be returned.
 */
ko.reloadableFilteredItems = function(data) {
	var itemsResult = function() {};

	itemsResult.filteredItems = [];
	itemsResult.doReload = ko.observable(false);

	itemsResult.items = ko.computed(function() {
    	//will be only computed if the related reload flag is set
    	if (itemsResult.doReload()) {
    		itemsResult.filteredItems = ko.toJS(
    			ko.utils.arrayFilter(data.items(), function(item) {
    				return data.filterFunction(item);
    			})
    		);
    		itemsResult.doReload(false);
    	}
    	return itemsResult.filteredItems;
    });

	itemsResult.itemsAsJSON = function() {
		return ko.toJSON(itemsResult.items);
	};

	itemsResult.hasItems = ko.computed(function() {
        return itemsResult.items().length > 0;
    });

	itemsResult.reloadItems = function() {
		itemsResult.doReload(true);
    };

	return itemsResult;
};