import React, { useState, useEffect } from "react";
import "./AddEdit.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyIcon from "../../../Assets/Products/empty_icon.png";
import {
  ADD_PRODUCT_API,
  PRODUCT_DETAILS_API,
  UPDATE_PRODUCT_API,
  urlToFile,
} from "../../../Data/helpers";

let initStates = {
  productId: undefined,
  productName: "",
  productPrice: "",
  productCategory: 1,
  productImage: undefined,
  status: 1,
};

const Modal = ({ showModal, closeModal, fetchProducts }) => {
  const [productData, setProductData] = useState(initStates);
  const [imagePreview, setImagePreview] = useState(EmptyIcon);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id"); // Get the ID from the query params

  const removeEditProductParam = () => {
    queryParams.delete("id");
    navigate(
      {
        pathname: location.pathname,
        search: queryParams.toString(),
      },
      { replace: true }
    );
  };

  const handleCloseModal = () => {
    removeEditProductParam();
    setProductData(initStates);
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isImage = Boolean(name === "productImage");
    setProductData({
      ...productData,
      [name]: isImage ? e.target.files[0] : value,
    });
    isImage && setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  // Fetch product details by ID if in edit mode
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        setIsEdit(true);
        setLoading(true);
        try {
          const response = await axios.get(
            `${PRODUCT_DETAILS_API}/${productId}`
          );
          const product = response?.data[0];
          setProductData({
            productId: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productCategory: product.productCategory || 1,
            productImage: product.productImage || undefined,
          });
        } catch (err) {
          setError("Failed to load product details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  // handle Add/Edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    const isImageFormatted = Boolean(
      productData?.productImage && typeof productData?.productImage !== "string"
    );
    isEdit && formData.append("productId", productData.productId);
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productCategory", productData.productCategory);
    formData.append("status", 1);
    formData.append(
      "productImage",
      isImageFormatted
        ? productData.productImage
        : urlToFile(productData.productImage)
    );
    try {
      let response;
      if (isEdit) {
        // Update existing product
        response = await axios.post(UPDATE_PRODUCT_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Add new product
        response = await axios.post(ADD_PRODUCT_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      debugger;
      if (response.status === 200) {
        setSuccess(
          isEdit
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        toast.success(
          isEdit
            ? "Product updated successfully!"
            : "Product added successfully!",
          {
            duration: 2000,
            style: {
              backgroundColor: "#07bc0c",
              color: "white",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#07bc0c",
            },
          }
        );
        fetchProducts(); // Call the function to update the product list in parent
        closeModal();
      }
    } catch (err) {
      setError(
        isEdit
          ? "Failed to update product."
          : "An error occurred while adding the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>{isEdit ? "Edit" : "Add New"} Product</h2>
          <button className="closeButton" onClick={handleCloseModal}>
            ×
          </button>
        </div>
        <form className="modalForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="parent-section" htmlFor="productImage">
              <span>Product Image</span>
              <img
                src={
                  typeof productData?.productImage === "string"
                    ? productData?.productImage
                    : imagePreview
                }
                className="img-preview"
                alt="product image"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              id="productImage"
              name="productImage"
              className="hidden"
              onChange={handleChange}
              required={!isEdit}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productData.productName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="productPrice">Product Price</label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={productData.productPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="productCategory">Product Category</label>
            <select
              id="productCategory"
              name="productCategory"
              value={productData.productCategory}
              onChange={handleChange}
              required
            >
              <option value={1}>Electronics</option>
              <option value={2}>Accessories</option>
            </select>
          </div>
          <button className="mt-30" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Modal;
