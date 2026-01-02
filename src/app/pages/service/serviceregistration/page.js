"use client";

import api from "@/app/lib/api";
import { useState } from "react"; 
export default function CreateServicePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("servicename", e.target.servicename.value);
      formData.append("description", e.target.description.value);
      formData.append("category", e.target.category.value);

      const price = {
        mrp: Number(e.target.mrp.value),
        selling_price: Number(e.target.selling_price.value),
        discount_percent: Number(e.target.discount_percent.value),
      };

      formData.append("price", JSON.stringify(price));
      formData.append("status", e.target.status.value);
      formData.append("date", e.target.date.value);
      formData.append("time", e.target.time.value);

      images.forEach((img) => {
        formData.append("images", img);
      });

      const response = await api.post("/service", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Service Created Successfully!");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error creating service");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center p-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-xl p-8 rounded-xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create Service</h1>

        {/* Service Name */}
        <div>
          <label className="block font-semibold mb-1">Service Name</label>
          <input
            type="text"
            name="servicename"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">MRP</label>
            <input
              type="number"
              name="mrp"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Selling Price</label>
            <input
              type="number"
              name="selling_price"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Discount %</label>
            <input
              type="number"
              name="discount_percent"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select name="status" className="w-full p-2 border rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input type="date" name="date" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Time</label>
            <input type="time" name="time" className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block font-semibold mb-1">
            Upload Images (Max 5)
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}
