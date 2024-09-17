export const SAMPLE_TOKEN = process.env.REACT_APP_SAMPLE_TOKEN;
export const LOGIN_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/login`;
export const SIGNUP_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/signUp`;
export const PRODUCT_LIST_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/productDisplay`;
export const ADD_PRODUCT_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/addProduct`;
export const PRODUCT_DETAILS_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/productEdit`;
export const UPDATE_PRODUCT_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/updateProduct`;
export const FILTER_PRODUCT_API = `${process.env.REACT_APP_ECOMM_BASE_URL}/productSearch`;

// helper functions
export function urlToFile(url) {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const file = new File([], fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
    lastModifiedDate: new Date(),
  });
  return file;
}
