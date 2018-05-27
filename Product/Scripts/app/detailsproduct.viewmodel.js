function DetailsProductViewModel(app, dataModel) {
    var self = this;
    var date = new Date();
    
    self.allowWriteAction = actions.indexOf("write") > -1;
    self.allowReadAction = actions.indexOf("read") > -1;

    self.Name = ko.observable("")
    self.Available = ko.observable(true);
    self.Price = ko.observable(0.0)
    self.Description = ko.observable("")
    self.DateCreated = ko.observable(date.toDateString());

    // Behaviors
    self.goToList = function () { location.href = location.origin + "/Products" };
    
    self.successMessage = function (message) {
        alert(message);
    };

    Sammy(function () {
        this.get('/Products/Details/:id', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                type: 'get',
                url: app.dataModel.productsUrl + '/' + idProduct,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    self.Name(data.name);
                    self.Available(data.available);
                    self.Price(data.price);
                    self.Description(data.description);
                    self.DateCreated(new Date(data.dateCreated).toDateString());
                },
                error: function (error) {
                    var message = error.responseJSON ? error.responseJSON.message : error.responseText;
                    if (message.trim().length == 0) message = error.statusText;
                    common.errorMessage(message);

                    if (error.status == "404") self.goToList();
                }
            });
        });
       
    });

    return self;
}

app.addViewModel({
    name: "DetailsProduct",
    bindingMemberName: "detailsproduct",
    factory: DetailsProductViewModel
});