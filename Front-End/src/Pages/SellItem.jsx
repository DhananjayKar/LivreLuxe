import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Pages/Authentic/firebaseConfig";
import { useNavigate } from "react-router-dom";

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
  
    try {
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
          toast.error(errorData.error || "Failed to create new category");
          return;
        }
  
        toast.success("New category added!");
      }
  
      toast.loading("Uploading image...");
  
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("newPrice", newPrice);
      if (oldPrice) formData.append("oldPrice", oldPrice);
      if (author) formData.append("author", author.trim());
      formData.append("category", addingCategory ? newCategory.trim() : category.trim());
      formData.append("image", image);
      formData.append("id", generateCustomId());
  
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: formData,
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
        <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required className="w-full p-2" />

        <div>
          <label className="block font-medium mb-1">Category</label>
          {addingCategory ? (
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category Name" className="w-full p-2 border rounded" />
          ) : (
            <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded">
              <option value="" className="hidden">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setAddingCategory(!addingCategory)}
            className="text-blue-600 mt-1 underline"
          >
            {addingCategory ? "Cancel new category" : "+ Add new category"}
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}