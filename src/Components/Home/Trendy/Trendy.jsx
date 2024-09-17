import React, { useEffect, useState } from "react";
import "./Trendy.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Redux/Slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus, FaPencilAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import Product_3_1 from "../../../Assets/Products/product_3-1.jpg";
import Modal from "../Forms/AddEdit";
import { FILTER_PRODUCT_API, PRODUCT_LIST_API } from "../../../Data/helpers";

const Trendy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("tab1");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fetch products based on category
  const fetchProducts = async (category = null) => {
    setLoading(true);
    setError(null);

    let url = PRODUCT_LIST_API;
    if (category) {
      url = `${FILTER_PRODUCT_API}?category=${category}`;
    }
    try {
      const response = await axios.get(url);
      if (response && response.data) {
        setProducts(response.data);
      } else {
        toast.error("Invalid response from the server", {
          duration: 2000,
          style: {
            backgroundColor: "#ff0000",
            color: "white",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ff0000",
          },
        });
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial product fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    const productInCart = cartItems.find((item) => item.id === product.id);

    if (productInCart && productInCart.quantity >= 20) {
      toast.error("Product limit reached", {
        duration: 2000,
        style: {
          backgroundColor: "#ff4b4b",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff4b4b",
        },
      });
    } else {
      dispatch(addToCart(product));
      toast.success(`Added to cart!`, {
        duration: 2000,
        style: {
          backgroundColor: "#07bc0c",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#07bc0c",
        },
      });
    }
  };

  const handleEditProduct = (id) => {
    setShowModal(true);
    navigate(`?id=${id}`);
  };

  const handleTabClick = (tab, category) => {
    setActiveTab(tab);
    if (tab === "tab1") {
      fetchProducts(); // Fetch all products
    } else {
      fetchProducts(category); // Fetch filtered products
    }
  };

  if (loading) {
    return <div className="loadingClass">Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="trendyProducts">
        <div className="headerClass">
          <h2 className="mt-14">
            Trendy <span>Products</span>
          </h2>
          <div className="shoppingCartEmpty">
            <button onClick={() => setShowModal(true)}>Add Product</button>
          </div>
        </div>
        <div className="trendyTabs">
          <div className="tabs">
            <p
              onClick={() => handleTabClick("tab1")}
              className={activeTab === "tab1" ? "active" : ""}
            >
              All
            </p>
            <p
              onClick={() => handleTabClick("tab2", 1)}
              className={activeTab === "tab2" ? "active" : ""}
            >
              Electronics
            </p>
            <p
              onClick={() => handleTabClick("tab3", 2)}
              className={activeTab === "tab3" ? "active" : ""}
            >
              Accessories
            </p>
          </div>
          <div className="trendyTabContent">
            <div className="trendyMainContainer">
              {products.map((product, idx) => (
                <div className="trendyProductContainer" key={idx + product.id}>
                  <div className="trendyProductImages">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="trendyProduct_front"
                    />
                    <h4 onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </h4>
                  </div>
                  <div
                    className="trendyProductImagesCart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaCartPlus />
                  </div>
                  <div className="trendyProductInfo">
                    <div className="trendyProductCategoryWishlist">
                      <p>
                        {product.category === 1 ? "Electronics" : "Accessories"}
                      </p>
                      <FaPencilAlt
                        className="editIcon cursor-pointer"
                        onClick={() => handleEditProduct(product.id)}
                      />
                    </div>
                    <div className="trendyProductNameInfo">
                      <Link to="/Product" onClick={scrollToTop}>
                        <h5>{product.productName}</h5>
                      </Link>
                      <p>₹{product.productPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default Trendy;
