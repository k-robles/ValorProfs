using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using Product.Models;

namespace Product.Controllers
{
    [Authorize]
    public class ProductController : ApiController
    {        
        private static List<ProductViewModel> _productViewModel = new List<ProductViewModel>();
        private ApplicationUserManager _userManager;

        public ProductController()
        {
            _userManager = _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
        }

        public ProductController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }
       
        // GET api/<controller>
        [Authorize(Roles="admin, user")]
        public IHttpActionResult Get()
        {
            if (_productViewModel == null || _productViewModel.Count == 0)
                return NotFound();
            else
                return Ok(_productViewModel.Select(
                    p => new DisplayProductViewModel { Id = p.Id, Name = p.Name, Available = p.Available, Price = p.Price }));
        }

        // GET api/<controller>/5
        [Authorize(Roles = "admin, user")]
        public IHttpActionResult Get(int id)
        {
            if (id < 0)
                return BadRequest("The product Id should be greater than 0");

            try
            {
                var product = _productViewModel.Where(p => p.Id == id);
                if (product == null || product.Count() == 0)
                    return NotFound();
                else
                    return Ok(product.First());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<controller>
        [Authorize(Roles = "admin")]
        public IHttpActionResult Post(ProductViewModel product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (product == null)
                return BadRequest("The product to add is empty.");
           
            try
            {
                //validate name
                ProductViewModel prod = _productViewModel.SingleOrDefault(p => p.Name == product.Name);
                if (prod != null)
                    return Conflict();

                //generate id
                prod = _productViewModel.OrderByDescending(p => p.Id).FirstOrDefault();
                if (prod == null)
                    product.Id = 1;
                else
                    product.Id = prod.Id + 1;

                //add to the list
                _productViewModel.Add(product);
                return Ok("The product was created and has the Id : " + product.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<controller>/5
        [Authorize(Roles = "admin")]
        public IHttpActionResult Put(int id, ProductViewModel product)
        {
            if (id < 0)
                return BadRequest("The product Id should be greater than 0");
            else if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                ProductViewModel oldprod = _productViewModel.SingleOrDefault(p => p.Id == id);
                if (oldprod == null)
                    return NotFound();
                else
                {
                    oldprod.Name = product.Name;
                    oldprod.Price = product.Price;
                    oldprod.Available = product.Available;
                    oldprod.Description = product.Description;
                    return Ok("The product was updated successfully.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<controller>/5     
        [Authorize(Roles = "admin")]
        public IHttpActionResult Delete(int id)
        {            
            if (id < 0)
                return BadRequest("The product Id should be greater than 0");

            try
            {
                ProductViewModel oldprod = _productViewModel.SingleOrDefault(p => p.Id == id);
                if (oldprod == null)
                    return NotFound();
                else
                {
                    _productViewModel.Remove(oldprod);
                    return Ok(_productViewModel);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}