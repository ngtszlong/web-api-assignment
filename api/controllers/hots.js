const mongoose = require("mongoose");

const Hot = require("../models/hots");
const Product = require("../models/products");

exports.hots_get_all = (req, res, next) => {
  Hot.find()
    .select("product _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        hots: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            request: {
              type: "GET",
              url: "http://localhost:3000/hot/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.hots_create_hot = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const hot = new Hot({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId
      });
      return hot.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Hot Item stored",
        createdHot: {
          _id: result._id,
          product: result.product
        },
        request: {
          type: "POST",
          url: "http://localhost:3000/hot/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.hots_get_hot = (req, res, next) => {
  Hot.findById(req.params.hotId)
    .populate("product")
    .exec()
    .then(hot => {
      if (!hot) {
        return res.status(404).json({
          message: "Hot Item not found"
        });
      }
      res.status(200).json({
        hot: hot,
        request: {
          type: "GET",
          url: "http://localhost:3000/hot"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.hots_delete_hot = (req, res, next) => {
  Hot.remove({ _id: req.params.hotId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Hot Item removed",
        request: {
          type: "DELETE",
          url: "http://localhost:3000/hot",
          body: { productId: "ID"}
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};