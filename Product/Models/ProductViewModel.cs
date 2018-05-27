using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Product.Models
{
    public class ProductViewModel
    {
        [Display(Name = "Id")]
        [Editable(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Editable(true)]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Available")]
        [Editable(true)]
        public bool Available { get; set; }

        [Required]
        [Display(Name = "Price")]
        [Editable(true)]
        public double Price { get; set; }

        [Display(Name = "Description")]
        [StringLength(250)]
        [Editable(true)]
        public string Description { get; set; }

        [Display(Name = "DateCreated")]        
        public DateTime DateCreated { get; set; }
    }

    public class DisplayProductViewModel
    {
        [Display(Name = "Id")]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Available")]
        public bool Available { get; set; }

        [Required]
        [Display(Name = "Price")]
        public double Price { get; set; }
    }
}