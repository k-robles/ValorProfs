function DetailsProductViewModel(app, dataModel) {
    var self = this;
    var date = new Date();
    
    if (location.hash) idProduct = location.hash.substr(1, location.hash.length - 1);

    self.allowWriteAction = ko.observable(actions.indexOf("write") > -1);
    self.allowReadAction = ko.observable(actions.indexOf("read") > -1);

    self.userEmail = app.dataModel.getAccessEmail();
    self.Name = ko.observable("")
    self.Available = ko.observable(true);
    self.Price = ko.observable(0.0)
    self.Description = ko.observable("")
    self.DateCreated = ko.observable(date.toDateString());

    // Behaviors
    self.goToList = function () {
        if (location.href.indexOf("spa") > 1)
            location.href = location.origin + "/spa/productlist.html"
        else
            location.href = location.origin + "/Products"
    };
    
    self.successMessage = function (message) {
        alert(message);
    };

    Sammy(function () {
        this.get('#roles', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                type: 'get',
                url: '/api/account',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    self.allowWriteAction(data.indexOf("write") > -1);
                    self.allowReadAction(data.indexOf("read") > -1);
                },
                error: function (error) {
                    if (error.status == "404")
                        self.isListVisible(false);
                    else
                        common.errorMessage(error.responseJSON.message);
                }
            });
        });
        this.get('#details', function () {
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
        this.get('/Products/Details/:id', function () {
            this.app.runRoute('get', '#details');
        });
        this.get('/spa/productdetails.html#:id', function () {
            this.app.runRoute('get', '#roles');
            this.app.runRoute('get', '#details');
        });
    });

    return self;
}

app.addViewModel({
    name: "DetailsProduct",
    bindingMemberName: "detailsproduct",
    factory: DetailsProductViewModel
});