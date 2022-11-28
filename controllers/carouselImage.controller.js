const CarouselImage = require("../models/CarouselImage");
const fs = require("fs");

exports.uploadImage = async (req, res) => {
  const newImage = new CarouselImage({
    imageUrl: `${req.protocol}://${req.get("host")}/uploads/images/carousel/${
      req.file.filename
    }`,
  });

  if (res.locals.user === null) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const image = await newImage.save();
    return res.status(201).json(image);
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.getImages = (req, res) => {
  CarouselImage.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};

exports.deleteImage = (req, res) => {
  if (res.locals.user === null) res.status(401).json({ error: "Non autorisé" });

  CarouselImage.findOne({ _id: req.params.id })
    .then((image) => {
      const filename = image.imageUrl.split("/uploads/images/carousel")[1];
      fs.unlink(`uploads/images/carousel/${filename}`, (err) => {
        if (err) throw err;
      });
      CarouselImage.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Delete error : " + err);
      });
    })
    .catch((err) => res.status(500).json(err));
};
