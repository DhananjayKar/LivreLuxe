import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Pages/Authentic/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { uploadImageToSupabase } from "../Utils/uploadImage";

const generateCustomId = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
  const randomDigit = () => Math.floor(Math.random() * 10);
  return randomLetter() + randomLetter() + randomDigit();
};

export default function SellItem() {
  const [name, setName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in!");

    if (!image) return toast.error("Please upload an image");

    try {
      // 1️⃣ If adding category
      if (addingCategory) {
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({ name: newCategory.trim() }),
        });

        if (!catRes.ok) {
          const errorData = await catRes.json();
          toast.error(errorData.error || "Failed to create category");
          return;
        }

        toast.success("New category added!");
      }

      toast.loading("Uploading image...");

      // 2️⃣ Upload image to Supabase
      const uploaded = await uploadImageToSupabase(image);

      toast.dismiss();
      toast.loading("Saving product...");

      // 3️⃣ Build product data
      const formData = {
        id: generateCustomId(),
        name: name.trim(),
        newPrice,
        oldPrice,
        author: author.trim(),
        category: addingCategory ? newCategory.trim() : category.trim(),
        imageUrl: uploaded.url,
        imageFilename: uploaded.filename,
      };

      // 4️⃣ Send metadata to backend (MongoDB)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const savedId = await res.json();

      toast.success("Product listed successfully!");
      navigate(`/book/${savedId.id}`);

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      toast.dismiss();
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-xl">
        Please{" "}
        <span
          className="text-blue-600 underline cursor-pointer"
          onClick={() => navigate("/auth")}
        >
          log in
        </span>{" "}
        to sell an item.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell an Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Book/Item Name" className="w-full p-2 border rounded" />
        <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required type="number" placeholder="New Price" className="w-full p-2 border rounded" />
        <input value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} type="number" placeholder="Old Price (optional)" className="w-full p-2 border rounded" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author (optional)" className="w-full p-2 border rounded" />

        <label htmlFor="image" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
          Upload Cover Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: "none" }}
        />

        {image && (
          <p className="mt-2 text-sm text-gray-700">
            Selected: <strong>{image.name}</strong>
          </p>
        )}

        <div>
          <label className="block font-medium mb-1">Category</label>

          <AnimatePresence mode="wait">
            {!addingCategory ? (
              <motion.select
                key="category-select"
                value={category}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setAddingCategory(true);
                    setCategory("");
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                required
                className="w-full p-2 border rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <option value="" className="hidden">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
                <option value="__new__">➕ Add new category</option>
              </motion.select>
            ) : (
              <motion.div
                key="new-category-input"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category Name"
                  className="w-full p-2 border rounded"
                />
                <motion.button
                  type="button"
                  onClick={() => setAddingCategory(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto mt-2 px-4 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 block w-fit text-sm shadow"
                >
                  ✖ Cancel
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}
