const Product = require("../Models/product");
const ApiFeatures = require("../util/apifeatures");
const { ErrorHandler } = require("../util/errorhandler");


async function CreateProduct(req, res) {

    req.body.user=req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })

}
async function GetAllProducts(req, res) {
    const ResultPerPage = 5;
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(ResultPerPage)
    const product = await apiFeature.query;
    res.status(200).json({
        success: true,
        product,
    });

}

async function UpdateProduct(req, res) {
    let product = Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        success: true,
        product

    })
}

async function deleteProduct(req, res) {
    const product = Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
}


async function ProductDetails(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    CreateProduct,
    GetAllProducts,
    UpdateProduct,
    deleteProduct,
    ProductDetails,
}