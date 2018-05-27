using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Product.Controllers
{
    [Authorize]
    public class ProductsController : Controller
    {
        // GET: Products
        [Authorize(Roles = "admin, user")]
        public ActionResult Index()
        {
            ViewBag.Actions = allowedActions();
            ViewBag.Title = "Valor Profs";
            return View();
        }

        // GET: Products/Details/5
        [Authorize(Roles = "admin, user")]
        public ActionResult Details(int id)
        {
            ViewBag.Actions = allowedActions();
            ViewBag.Title = "Valor Profs";
            ViewBag.Id = id;
            return View();
        }

        // GET: Products/Create
        [Authorize(Roles = "admin")]
        public ActionResult Create()
        {
            ViewBag.Actions = allowedActions();
            ViewBag.Title = "Valor Profs";
            ViewBag.Id = 0;
            return View("Edit");
        }

       
        // GET: Products/Edit/5
        [Authorize(Roles = "admin")]
        public ActionResult Edit(int id)
        {
            ViewBag.Actions = allowedActions();
            ViewBag.Title = "Valor Profs";
            ViewBag.Id = id;
            return View();
        }

        private string[] allowedActions()
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

            return results.ToArray();
        }

    }
}
