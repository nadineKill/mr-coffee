/**
 * Extender for observable values to log changes to the console.
 *
 * @param {object} target The object which should be observed for state changes.
 * @param {string} valueName The name of the value which will be observed.
 */
ko.extenders.logChange = function(target, valueName) {
    target.subscribe(function(newValue) {
       console.log(valueName + ": " + newValue);
    });
    return target;
};
