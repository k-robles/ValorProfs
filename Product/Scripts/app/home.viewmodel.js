function HomeViewModel(app, dataModel) {
    var self = this;

    self.Email = ko.observable("");
    self.Password = ko.observable("");
    
    self.requestLogin = function () {    
        var login ={
            Email : self.Email(),
            Password : self.Password(),
            Remember : true 
        };
        $.ajax({
            type: 'POST',
            url: "/api/account",
            data: login,
            success: function (message) {
                app.dataModel.setAccessEmail(self.Email());
                location.href = location.origin + "/spa/productlist.html";
            },
            error: function (error) {
                alert("An error has ocurred.");
            }
        });        
    };

    Sammy(function () {
        this.get('/', function () { });
        this.get('/spa/login.html', function () { });
    });

    return self;
}

app.addViewModel({
    name: "Home",
    bindingMemberName: "home",
    factory: HomeViewModel
});
