import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../ConfirmModel/ConfirmModal";
import { useAuth } from "../../Context/AuthProvider";

const ProductPanel = ({ refreshCounts }) => {
  const [products, setProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    author: "",
    newPrice: "",
    oldPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const PRODUCTS_PER_PAGE = 30;

  const { firebaseUser } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [API]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const confirmDeleteProduct = async () => {
    if (!firebaseUser) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    try {
      const token = await firebaseUser.getIdToken();

      await fetch(`${API}/api/products/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== deleteProductId));
      if (refreshCounts) refreshCounts();
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditData({
      name: product.name,
      author: product.author,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
    });
  };

  const handleSave = async () => {
    try {
      const token = await firebaseUser.getIdToken();

      await fetch(`${API}/api/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      toast.success("Product updated!");
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct ? { ...p, ...editData } : p
        )
      );
      setEditingProduct(null);
      if (refreshCounts) refreshCounts();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">📚 All Products</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow transition"
              >
                <div
                  onClick={() => toggleExpand(product._id)}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-sm text-blue-500">
                    {expandedId === product._id ? "▲ Hide" : "▼ Details"}
                  </span>
                </div>

                {expandedId === product._id && (
                  <div className="mt-4 text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Author:</strong> {product.author}
                    </p>
                    <p>
                      <strong>New Price:</strong> ₹{product.newPrice}
                    </p>
                    <p>
                      <strong>Old Price:</strong> ₹{product.oldPrice}
                    </p>
                    <p>
                      <strong>Reviews:</strong>{" "}
                      {product.reviews?.length || 0}
                    </p>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded transition transform hover:scale-110 hover:bg-yellow-600"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteProductId(product._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded transition transform hover:scale-110 hover:bg-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-1 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Edit Product</h2>

            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
              className="w-full border p-2 rounded"
            />
            <input
              value={editData.author}
              onChange={(e) =>
                setEditData({ ...editData, author: e.target.value })
              }
              placeholder="Author"
              className="w-full border p-2 rounded"
            />
            <input
              value={editData.newPrice}
              onChange={(e) =>
                setEditData({ ...editData, newPrice: e.target.value })
              }
              placeholder="New Price"
              type="number"
              className="w-full border p-2 rounded"
            />
            <input
              value={editData.oldPrice}
              onChange={(e) =>
                setEditData({ ...editData, oldPrice: e.target.value })
              }
              placeholder="Old Price"
              type="number"
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteProductId && (
        <ConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onConfirm={confirmDeleteProduct}
          onCancel={() => setDeleteProductId(null)}
        />
      )}
    </div>
  );
};

export default ProductPanel;