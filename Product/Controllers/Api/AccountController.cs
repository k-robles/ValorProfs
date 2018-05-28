using Product.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Security.Claims;

namespace Product.Controllers.Api
{
    public class AccountController : ApiController
    {
        private ApplicationUserManager _userManager;
        private ApplicationSignInManager _signInManager;
        private IAuthenticationManager _authenticationManager;

        public AccountController()
        {
            _userManager = _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            _signInManager = HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            _authenticationManager = HttpContext.Current.GetOwinContext().Authentication;
        }

        public AccountController(ApplicationSignInManager signInManager, IAuthenticationManager authenticationManager)
        {
            _signInManager = signInManager;
            _authenticationManager = authenticationManager;
        }

        // GET api/<controller>
        [Authorize]
        public IHttpActionResult Get()
        {
            List<string> results = new List<string>();
            var roles = ((ClaimsIdentity)User.Identity).Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value);

            results.Add("read");
            foreach (var role in roles)
            {
                switch (role)
                {
                    case "admin":
                        results.Add("write");
                        break;
                }
            }

            return Ok(results.ToArray());
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "";
        }

        // POST api/<controller>
        [AllowAnonymous]
        public IHttpActionResult Post(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = _signInManager.PasswordSignIn(model.Email, model.Password, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return Ok();                
                case SignInStatus.Failure:
                default:
                    return NotFound();
            }

        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}