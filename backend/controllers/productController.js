import { sql } from "../config/db.js";

// CRUD operations for products

//for getting all the products
export const getProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.log("Error in getProducts function ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//for creating a new product
export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  if (!name || !image || !price) {
    res
      .status(400)
      .json({ success: false, message: "All fields are required." });

    return;
  }

  try {
    const newProduct = await sql`
        INSERT INTO products (name, image, price) VALUES (${name}, ${image}, ${price}) RETURNING *
    `;
    res.status(201).send({
      success: true,
      message: "Product saved successfully !!!",
      data: newProduct[0],
    });
  } catch (err) {
    console.log("Error in createProduct function ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//for getting a single product
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    res.status(200).json({ success: true, data: product[0] });
  } catch (err) {
    console.log("Error in getProduct fuction", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

//for updating a single product
export const updateProduct = async (req, res) => {
  const { name, image, price } = req.body;
  const { id } = req.params;

  if (!name || !image || !price) {
    res
      .status(400)
      .json({ success: false, message: "All fields are required." });

    return;
  }

  try {
    const updatedProduct = await sql`
        UPDATE products SET name=${name}, image=${image}, price=${price} WHERE id=${id} RETURNING *
    `;

    if (updateProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(201).send({
      success: true,
      message: "Product updated successfully !!!",
      data: updatedProduct[0],
    });
  } catch (err) {
    console.log("Error in updateProduct product ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//for deleting a single product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct =
      await sql`DELETE FROM products WHERE id=${id} RETURNING *`;

    if (deletedProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully !!!" });
  } catch (err) {
    console.log("Error in deleteProduct function");
    res.status(400).json({ success: false, message: err.message });
  }
};
