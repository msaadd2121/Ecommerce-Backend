const express = require("express")
const { CreateProduct,
      GetAllProducts,
      UpdateProduct,
      deleteProduct,
      ProductDetails } =
      require("../Controllers/product")
const { AuthenticatedUser ,AuthorizeRoles} = require("../middleware/auth");
const router = express.Router()

router.post("/product/new",  AuthenticatedUser, AuthorizeRoles("admin"),CreateProduct)

router.get("/products",GetAllProducts)

router.put("/product/:id", AuthenticatedUser, AuthorizeRoles("admin"),UpdateProduct)

router.delete("/product/:id", AuthenticatedUser, AuthorizeRoles("admin"),deleteProduct);

router.get("/product/:id", ProductDetails)


module.exports = router;