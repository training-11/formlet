import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const ProductPage = () => {
  const { category } = useParams(); // URL param: fresh-fruits
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert slug -> DB category name
  const slugToName = (slug) => {
    if (!slug) return null;
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${window.ENV.BACKEND_API}/api/public/categories`),
          fetch(`${window.ENV.BACKEND_API}/api/public/products`)
        ]);

        if (!catRes.ok || !prodRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData);
        setProducts(prodData);

        const categoryFromUrl = slugToName(category);

        if (
          categoryFromUrl &&
          catData.some(c => c.name === categoryFromUrl)
        ) {
          setSelectedCategory(categoryFromUrl);
        } else if (catData.length > 0) {
          setSelectedCategory(catData[0].name);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const currentCategoryObj = categories.find(
    c => c.name === selectedCategory
  );

  const filteredProducts = currentCategoryObj
    ? products.filter(p => p.category_id === currentCategoryObj.id)
    : [];

  return (
    <>
      <Header />

      <div className="container" style={{ padding: "20px" }}>
        <h2>{selectedCategory || "Products"}</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
                <button>Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;

