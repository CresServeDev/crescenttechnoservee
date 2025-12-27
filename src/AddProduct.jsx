import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    tag: "",
    category: "",
    color: "",
    rating: 5,
    reviews: 0,
    price: 0,
    compareAt: null,
    image: "",
    salePercent: 0,
    isNew: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const productToAdd = {
        ...product,
        images: [product.image], // Ensure images array is set
      };
      await addDoc(collection(db, "products"), productToAdd);
      setMessage("Product added successfully!");
      setProduct({
        title: "",
        tag: "",
        category: "",
        color: "",
        rating: 5,
        reviews: 0,
        price: 0,
        compareAt: null,
        image: "",
        salePercent: 0,
        isNew: false,
      });
    } catch (error) {
      setMessage(`Error adding product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tag:</label>
          <input
            type="text"
            name="tag"
            value={product.tag}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={product.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label>Reviews:</label>
          <input
            type="number"
            name="reviews"
            value={product.reviews}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Compare At Price:</label>
          <input
            type="number"
            name="compareAt"
            value={product.compareAt || ""}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Sale Percent:</label>
          <input
            type="number"
            name="salePercent"
            value={product.salePercent}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isNew"
              checked={product.isNew}
              onChange={handleChange}
            />
            Is New
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
