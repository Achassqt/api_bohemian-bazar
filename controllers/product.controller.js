const Product = require("../models/Product");
const fs = require("fs");

exports.uploadProduct = async (req, res) => {
  const newProduct = new Product(
    req.file
      ? {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/uploads/images/products/${req.file.filename}`,
        }
      : {
          ...req.body,
        }
  );

  if (res.locals.user === null) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const product = await newProduct.save();
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.getProducts = (req, res) => {
  Product.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};

exports.deleteProduct = (req, res) => {
  if (res.locals.user === null) res.status(401).json({ error: "Non autorisé" });

  Product.findOne({ _id: req.params.id })
    .then((product) => {
      if (product.imageUrl) {
        const filename = product.imageUrl.split("/uploads/images/products/")[1];
        fs.unlink(`uploads/images/products/${filename}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      Product.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Delete error : " + err);
      });
    })
    .catch((err) => res.status(500).json(err));
};

exports.updateProduct = (req, res) => {
  if (res.locals.user === null && res.locals.user.pseudo !== "admin") {
    return res.status(401).json({ error: "Non autorisé" });
  }

  Product.findOne({ _id: req.params.id }).then((product) => {
    if (req.file && product.imageUrl !== undefined) {
      const filename = product.imageUrl.split("/uploads/images/products/")[1];
      fs.unlink(`uploads/images/products/${filename}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    const productObject = req.file
      ? {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/uploads/images/products/${req.file.filename}`,
        }
      : {
          ...req.body,
        };

    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...productObject } },
      { new: true }
    )
      .then((product) => res.status(200).json(product))
      .catch((err) => res.status(400).json({ err }));
  });
};
