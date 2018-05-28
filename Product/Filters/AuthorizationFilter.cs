using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Product.Filters
{
    public class AutorizationFilter : AuthorizationFilterAttribute
    {
        /// <summary>
        /// read requested header and validated
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnAuthorization(HttpActionContext actionContext)
        {

            string AccessTokenFromRequest = "";
            if (actionContext.Request.Headers.Authorization != null)
            {
                // get the access token
                AccessTokenFromRequest = actionContext.Request.Headers.Authorization.Parameter;
            }
                
            base.OnAuthorization(actionContext);          

        }
     }
}