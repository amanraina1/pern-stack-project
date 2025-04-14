import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  //products state
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  formData: {
    name: "",
    price: "",
    image: "",
  },

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      document.getElementById("add_product_modal").close();
      toast.success("Product added successfully");
    } catch (err) {
      console.log("Error ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data,
        error: null,
      });
    } catch (err) {
      console.log("Error ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false, currentProduct: null });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });

    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData
      );
      set({ currentProduct: response.data.data });
      toast.success("Product Updated Successfully !!!");
    } catch (err) {
      console.log("Error ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  setFormData: (formData) => {
    set({ formData });
  },

  resetForm: () => set({ formData: { name: "", proce: "", image: "" } }),
}));
