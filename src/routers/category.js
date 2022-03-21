const express = require('express')
const auth = require('../middleware/auth')
const Category = require('../models/category')


const router = new express.Router()



//adding a product
router.post("/category/add", async (req, res) => {

  const category = await new Category({
    name: req.body.name,
    shopId: req.body.shopId
  });

  await category.save()

  res.send({message: "You have successfully added a category to the shop!"})

})

//adding a product
router.post("/category/update", async (req, res) => {

  let categoryToUpdate = await Category.findById(req.body.categoryId)
  categoryToUpdate.name = req.body.name;
  categoryToUpdate.shopId = req.body.shopId;

  await categoryToUpdate.save()

  res.send({ message: "you have successfully updated a category!"})
})

//delete a product
router.delete("/category/:id", async (req, res) => {
  const categoryId = req.params.id;
  
  //check if the product exist
  let caategoryToDelete = await Category.findById(categoryId)
  if (!caategoryToDelete) {
    res.send({ error: "category not found."})
  }

  //delete the product
  await Category.deleteOne({ _id: categoryId });
  res.send({message: "you have deleted a category successfully!"})
  
  })




module.exports = router
