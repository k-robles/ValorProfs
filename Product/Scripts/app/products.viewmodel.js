function ProductsViewModel(app, dataModel) {
    var self = this;

    self.userEmail = app.dataModel.getAccessEmail();
    self.isListVisible = ko.observable(false);
    self.allowWriteAction = ko.observable(actions.indexOf("write") > -1);
    self.allowReadAction = ko.observable(actions.indexOf("read") > -1);
    self.list = ko.observableArray();
    
    // Behaviors
    self.goToAdd = function () {
        if (location.href.indexOf("spa") > 1)
            location.href = location.origin + "/spa/editproduct.html";
        else
            location.href = location.href + "/Create";
    };
    self.goToDetails = function (product) {
        if (location.href.indexOf("spa") > 1)
            location.href = location.origin + "/spa/productdetails.html#" + product.id;
        else
            location.href = location.href + "/Details/" + product.id;
    };
    self.goToEdit = function (product) {
        if (location.href.indexOf("spa") > 1)
            location.href = location.origin + "/spa/editproduct.html#" + product.id;
        else
            location.href = location.href + '/Edit/' + product.id;
    };
    self.goToDelete = function (product) {
        var result = confirm("You are going to delete the product '" + product.name + "' . Are you sure?");
        if (result == true) {
            $.ajax({
                url: app.dataModel.productsUrl + "/" + product.id,
                type: "DELETE",                
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    if (data) {
                        self.list(data);
                    } else {
                        common.errorMessage("");
                    }
                },
                error: function (error) {
                    var message = error.responseJSON ? error.responseJSON.message : error.responseText;
                    if (message.trim().length == 0) message = error.statusText;
                    common.errorMessage(message);
                }
            });
        }
    };

    Sammy(function () {
        this.get('#products', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                type: 'get',
                url: app.dataModel.productsUrl,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    self.isListVisible(true);
                    self.list(data);                    
                },
                error: function (error) {
                    if (error.status == "404")
                        self.isListVisible(false);
                    else
                        common.errorMessage(error.responseJSON.message);
                }
            });
        });
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
        this.get('/Products', function () { this.app.runRoute('get', '#products') });
        this.get('/spa/productlist.html', function () {
            this.app.runRoute('get', '#roles');
            this.app.runRoute('get', '#products');
        });

    });

    return self;
}

app.addViewModel({
    name: "Products",
    bindingMemberName: "products",
    factory: ProductsViewModel
});
