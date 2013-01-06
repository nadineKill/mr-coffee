// Class to represent a row in the seat reservations grid
function Consumer(data) {
    var self = this;
    self.forename = ko.observable(data.forename);
    self.surname = ko.observable(data.surname);
}

// Overall view-model for this screen, along with initial state
function ConsumersViewModel() {
    var self = this;

    // Editable data
    self.consumers = ko.observableArray([]);
    /*
    self.consumers = ko.observableArray([
        new Consumer({"forename":"Markus", "surname":"Ruderman"}),
        new Consumer({"forename":"Kurt", "surname":"Graller"})
    ]);
    */

    // Operations
    self.addConsumer = function() {
        self.consumers.push(new Consumer("", "", ""));
    };

    self.removeConsumer = function(consumer) {
        self.consumers.remove(consumer);
    };


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

ko.applyBindings(new ConsumersViewModel());
