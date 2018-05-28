function EditProductViewModel(app, dataModel) {
    var self = this;
    var date = new Date();
       
    if (location.hash) idProduct = location.hash.substr(1, location.hash.length - 1);

    self.userEmail = app.dataModel.getAccessEmail();
    self.allowWriteAction = ko.observable(actions.indexOf("write") > -1);
    self.allowReadAction = ko.observable(actions.indexOf("read") > -1);
    self.isCreateView = idProduct == 0;
    self.isEditView = idProduct > 0;
    self.Name = ko.observable("").extend({ required: true, maxLength: 50 });
    self.Available = ko.observable(true);
    self.Price = ko.observable(0.0).extend({ required: true });
    self.Description = ko.observable("").extend({ maxLength: 250 });
    self.DateCreated = ko.observable(date.toDateString());

    // Behaviors
    self.goToList = function () {
        if (location.href.indexOf("spa") > 1)
            location.href = location.origin + "/spa/productlist.html"
        else
            location.href = location.origin + "/Products"
    };
    self.addProduct = function () {
        var newProduct = {
            Id: 0,
            Name: self.Name(),
            Available: self.Available(),
            Description: self.Description(),
            Price: self.Price(),
            DateCreated: date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
        };
        $.ajax(app.dataModel.productsUrl, {
            type: "post",
            data: newProduct,
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (message) {
                if (message) {
                    self.successMessage(message);
                    self.goToList();
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
    };
    self.updateProduct = function () {
        var product = {
            Id: idProduct,
            Name: self.Name(),
            Available: self.Available(),
            Description: self.Description(),
            Price: self.Price()
        };
        $.ajax(app.dataModel.productsUrl + "/" + idProduct, {
            type: "PUT",
            data: product,
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (message) {
                if (message) {
                    self.successMessage(message);
                    self.goToList();
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
        this.get('#edit',  function () {
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
        this.get('/Products/Create', function () { });
        this.get('/Products/Edit/:id', function () {
            this.app.runRoute('get', '#edit');
        });
        this.get('/spa/editproduct.html', function () {
            this.app.runRoute('get', '#roles');
        });
        this.get('/spa/editproduct.html#:id', function () {
            this.app.runRoute('get', '#roles');
            this.app.runRoute('get', '#edit');
        });
    });

    return self;
}

app.addViewModel({
    name: "EditProduct",
    bindingMemberName: "editproduct",
    factory: EditProductViewModel
});
