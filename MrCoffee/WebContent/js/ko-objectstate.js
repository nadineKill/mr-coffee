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
	var result = function() {};

    if ((id != undefined) && (id != "")) {
    	target.id = id;
    }

    return result;
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

	return stateResult;
};

