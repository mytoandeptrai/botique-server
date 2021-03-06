const Carts = require("../models/cartModels");
const Products = require("../models/productModels");

const cartCtrl = {
  createNewCart: async (req, res) => {
    try {
      const { idUser, idProduct, countProduct, sizeProduct } = req.body;

      const product = await Products.findOne({ _id: idProduct });

      const newProduct = await Products.findOneAndUpdate(
        { _id: idProduct },
        {
          count: product.count - parseInt(countProduct),
          sold: parseInt(product.sold) + parseInt(countProduct),
        },
        { new: true }
      );

      const currentProduct = await Products.findOne({ _id: newProduct._id });

      const carts = await Carts.findOne({
        idUser,
        idProduct,
        sizeProduct,
      });

      if (!carts) {
        const newCart = new Carts({
          idUser: idUser,
          idProduct: idProduct,
          nameProduct: product.title,
          priceProduct: product.price,
          sizeProduct,
          count: countProduct,
          img: product.imgs[0],
        });

        await newCart.save();

        res.json({ msg: "Thanh Cong!", newCart, currentProduct });
      } else {
        carts.count += parseInt(countProduct);

        carts.save();
        res.json({
          msg: "Thanh Cong!",
          newCart: { ...carts._doc },
          currentProduct,
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCart: async (req, res) => {
    try {
      const { idUser, idProduct, nameProduct, sizeProduct, count, img } =
        req.body;

      const newCart = await Carts.findOneAndUpdate(
        { _id: req.body._id },
        {
          idUser,
          idProduct,
          nameProduct,
          sizeProduct,
          count,
          img,
        },
        {
          new: true,
        }
      );

      res.json({ msg: "Update Thanh Cong!", newCart });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  increaseCartItem: async (req, res) => {
    try {
      const { idUser, idProduct, nameProduct, sizeProduct, count, img } =
        req.body;

      const product = await Products.findOne({ _id: idProduct });

      const newCart = await Carts.findOneAndUpdate(
        { _id: req.body._id },
        {
          idUser,
          idProduct,
          nameProduct,
          sizeProduct,
          count,
          img,
        },
        {
          new: true,
        }
      );

      const newProduct = await Products.findOneAndUpdate(
        { _id: idProduct },
        {
          count: product.count - 1,
          sold: parseInt(product.sold) + 1,
        },
        { new: true }
      );

      const currentProduct = await Products.findOne({ _id: newProduct._id });

      res.json({ msg: "Update Thanh Cong!", newCart, currentProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  decreaseCartItem: async (req, res) => {
    try {
      const { idUser, idProduct, nameProduct, sizeProduct, count, img } =
        req.body;

      const product = await Products.findOne({ _id: idProduct });

      const newCart = await Carts.findOneAndUpdate(
        { _id: req.body._id },
        {
          idUser,
          idProduct,
          nameProduct,
          sizeProduct,
          count,
          img,
        },
        {
          new: true,
        }
      );

      const newProduct = await Products.findOneAndUpdate(
        { _id: idProduct },
        { count: product.count + 1, sold: parseInt(product.sold) - 1 },
        { new: true }
      );

      const currentProduct = await Products.findOne({ _id: newProduct._id });

      res.json({ msg: "Update Thanh Cong!", newCart, currentProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCart: async (req, res) => {
    try {
      //L???y idUSer c???a user c???n x??a
      const idUser = req.query.idUser;

      //L???y idProduct c???a user c???n x??a
      const idProduct = req.query.idProduct;

      const countProduct = req.query.count;

      //T??m ????ng c??i s???n ph???m m?? User ???? th??m v??o gi??? h??ng
      var cart = await Carts.findOne({ idUser: idUser, idProduct: idProduct });

      const product = await Products.findOne({ _id: idProduct });

      const newProduct = await Products.findOneAndUpdate(
        { _id: idProduct },
        {
          count: product.count + parseInt(countProduct),
          sold: parseInt(product.sold) - parseInt(countProduct),
        },
        {
          new: true,
        }
      );

      const currentProduct = await Products.findOne({ _id: newProduct._id });

      cart.delete();
      res.json({ msg: "Cart has been deleted...", currentProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserCart: async (req, res) => {
    try {
      const idUser = req.query.idUser;

      const carts = await Carts.find({ idUser }).sort("-createdAt");

      res.json({ carts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = cartCtrl;
