const Product = require("../models/Product");
const fs = require("fs");
const { newProductsErrors } = require("../utils/errors.utils");

exports.uploadProduct = async (req, res) => {
  // convertir les données de tailles en tableau JSON
  let sizes = [];
  if (req.body.sizes) {
    try {
      sizes = JSON.parse(req.body.sizes);
    } catch (err) {
      return res.status(400).json({
        error:
          "Les tailles doivent être envoyées sous forme de tableau JSON valide",
      });
    }
  }
  const newProduct = new Product(
    req.file
      ? {
          ...req.body,
          sizes: sizes,
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/uploads/images/products/${req.file.filename}`,
        }
      : {
          ...req.body,
          sizes: sizes,
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

exports.getProduct = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((err) => res.status(404).json({ err }));
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
  // if (res.locals.user === null) {
  //   return res.status(401).json({ error: "Non autorisé" });
  // }

  Product.findOne({ _id: req.params.id }).then((product) => {
    if (req.file && product.imageUrl !== undefined) {
      const filename = product.imageUrl.split("/uploads/images/products/")[1];
      fs.unlink(`uploads/images/products/${filename}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    let sizes = [];
    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch (err) {
        return res.status(400).json({
          error:
            "Les tailles doivent être envoyées sous forme de tableau JSON valide",
        });
      }
    }

    const productObject = req.file
      ? {
          ...req.body,
          sizes: sizes,
          imageUrl: `${req.protocol}://${req.get(
            "host"
          )}/uploads/images/products/${req.file.filename}`,
        }
      : {
          ...req.body,
          sizes: sizes,
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
