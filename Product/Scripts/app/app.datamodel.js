function AppDataModel() {
    var self = this;
    // Routes
    //self.userInfoUrl = "/api/ApiProduct";
    self.productsUrl = "/api/product";
    self.siteUrl = "/";

    // Route operations

    // Other private operations

    // Operations

    // Data
    self.returnUrl = self.siteUrl;

    // Data access operations
    self.setAccessToken = function (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
    };

    self.getAccessToken = function () {
        return sessionStorage.getItem("accessToken");
    };
    // Data access operations
    self.setAccessEmail = function (accessEmail) {
        sessionStorage.setItem("accessEmail", accessEmail);
    };

    self.getAccessEmail = function () {
        return sessionStorage.getItem("accessEmail");
    };
}
