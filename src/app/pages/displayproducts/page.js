"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Pencil, X } from "lucide-react";
import Image from "next/image";
import api from "@/app/lib/api";
 

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    if (!isMounted) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/products");
      if (isMounted) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (isMounted) {
        setError("Failed to load products");
        setProducts([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchProducts();
    }
  }, [isMounted]);

  // Delete product
  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await api.post(`/products/delete/${deleteModal.id}`);
   
      setDeleteModal(null);
      fetchProducts();
    } catch (error) {
      console.log("Delete error:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
    

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Image</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                    <th className="px-6 py-4 text-left font-semibold">Brand</th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-left font-semibold">Stock</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <Image
                          src={p.images?.[0]?.url}
                          width={60}
                          height={60}
                          alt="product"
                          className="rounded-lg shadow-md object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-gray-700">{p.category}</td>
                      <td className="px-6 py-4 text-gray-700">{p.brand}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-green-600">₹{p.price?.selling_price}</span>
                          <span className="line-through text-gray-400 text-xs">₹{p.price?.mrp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.inventory?.stock_quantity > 10 
                            ? 'bg-green-100 text-green-800' 
                            : p.inventory?.stock_quantity > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.inventory?.stock_quantity}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setViewProduct(p)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="View Product"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => router.push(`/pages/products?id=${p.id}`)}
                            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Edit Product"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => setDeleteModal(p)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="text-red-600" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Product?</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{viewProduct.name}</h2>
              <button
                onClick={() => setViewProduct(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6">
              {/* Images Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {viewProduct.images?.map((img) => (
                  <Image
                    key={img._id}
                    src={img.url}
                    width={200}
                    height={200}
                    alt="product"
                    className="rounded-lg shadow-md w-full h-48 object-cover"
                  />
                ))}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">PRODUCT ID</h3>
                  <p className="text-gray-900 font-mono">{viewProduct.id}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">DESCRIPTION</h3>
                  <p className="text-gray-900">{viewProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">CATEGORY</h3>
                    <p className="text-gray-900">{viewProduct.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">SUB CATEGORY</h3>
                    <p className="text-gray-900">{viewProduct.sub_category}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">BRAND</h3>
                  <p className="text-gray-900">{viewProduct.brand}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <h3 className="text-sm font-semibold text-green-700 mb-2">SELLING PRICE</h3>
                    <p className="text-2xl font-bold text-green-600">₹{viewProduct.price?.selling_price}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">MRP</h3>
                    <p className="text-xl font-semibold text-gray-400 line-through">₹{viewProduct.price?.mrp}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">DISCOUNT</h3>
                    <p className="text-2xl font-bold text-blue-600">{viewProduct.price?.discount_percent}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">QUANTITY</h3>
                    <p className="text-gray-900 font-semibold">
                      {viewProduct.quantity_info?.size} {viewProduct.quantity_info?.unit}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">STOCK</h3>
                    <p className={`text-xl font-bold ${
                      viewProduct.inventory?.stock_quantity > 10 
                        ? 'text-green-600' 
                        : viewProduct.inventory?.stock_quantity > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {viewProduct.inventory?.stock_quantity} units
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">STATUS</h3>
                  <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                    viewProduct.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewProduct.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.tags?.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={() => setViewProduct(null)}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}