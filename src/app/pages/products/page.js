 "use client"

 import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    sub_category: '',
    brand: '',
    'price.mrp': '',
    'price.selling_price': '',
    'price.discount_percent': '',
    'quantity_info.unit': '',
    'quantity_info.size': '',
    'inventory.stock_available': true,
    'inventory.stock_quantity': '',
    tags: '',
    'nutritional_info.calories': '',
    'nutritional_info.protein': '',
    'nutritional_info.fat': '',
    'nutritional_info.carbohydrates': '',
    'nutritional_info.fiber': '',
    'nutritional_info.other_details': '',
    'vendor.vendor_id': '',
    'vendor.vendor_name': '',
    shelf_life: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    setFetchingProduct(true);
    try {
      const response = await fetch(`https://api.keeva.in/products`);
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.products) {
          const product = data.products.find(p => p._id === id || p.id === id);
          if (product) {
            setFormData({
              id: product.id || '',
              name: product.name || '',
              description: product.description || '',
              category: product.category || '',
              sub_category: product.sub_category || '',
              brand: product.brand || '',
              'price.mrp': product.price?.mrp || '',
              'price.selling_price': product.price?.selling_price || '',
              'price.discount_percent': product.price?.discount_percent || '',
              'quantity_info.unit': product.quantity_info?.unit || '',
              'quantity_info.size': product.quantity_info?.size || '',
              'inventory.stock_available': product.inventory?.stock_available ?? true,
              'inventory.stock_quantity': product.inventory?.stock_quantity || '',
              tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
              'nutritional_info.calories': product.nutritional_info?.calories || '',
              'nutritional_info.protein': product.nutritional_info?.protein || '',
              'nutritional_info.fat': product.nutritional_info?.fat || '',
              'nutritional_info.carbohydrates': product.nutritional_info?.carbohydrates || '',
              'nutritional_info.fiber': product.nutritional_info?.fiber || '',
              'nutritional_info.other_details': product.nutritional_info?.other_details || '',
              'vendor.vendor_id': product.vendor?.vendor_id || '',
              'vendor.vendor_name': product.vendor?.vendor_name || '',
              shelf_life: product.shelf_life || '',
              status: product.status || 'active'
            });
            setExistingImages(product.images || []);
          } else {
            toast.error('Product not found');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setFetchingProduct(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.keeva.in/products');
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.products) {
          const uniqueCategories = [...new Set(data.products.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max size is 5MB`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        return;
      }

      newImages.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      sub_category: '',
      brand: '',
      'price.mrp': '',
      'price.selling_price': '',
      'price.discount_percent': '',
      'quantity_info.unit': '',
      'quantity_info.size': '',
      'inventory.stock_available': true,
      'inventory.stock_quantity': '',
      tags: '',
      'nutritional_info.calories': '',
      'nutritional_info.protein': '',
      'nutritional_info.fat': '',
      'nutritional_info.carbohydrates': '',
      'nutritional_info.fiber': '',
      'nutritional_info.other_details': '',
      'vendor.vendor_id': '',
      'vendor.vendor_name': '',
      shelf_life: '',
      status: 'active'
    });
    setImages([]);
    setImagePreviews([]);
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = [
      'name', 'description', 'category',
      'price.mrp', 'price.selling_price',
      'quantity_info.unit', 'quantity_info.size',
      'inventory.stock_quantity',
      'vendor.vendor_id', 'vendor.vendor_name'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field} is required`);
        setLoading(false);
        return;
      }
    }

    // Create FormData for multipart upload
    const formDataToSend = new FormData();

    // Append all form data (including nested fields)
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        if (typeof formData[key] === 'boolean') {
          formDataToSend.append(key, formData[key].toString());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    // Append tags properly
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      tagsArray.forEach(tag => {
        formDataToSend.append('tags', tag);
      });
    }

    // Append images
    images.forEach((image, index) => {
      formDataToSend.append('images', image);
    });

    try {
      const url = productId 
        ? `https://api.keeva.in/products/edit/${productId}` 
        : 'https://api.keeva.in/products';
      
      const method = 'POST'; // Backend route is POST for both create and edit (edit is /products/edit/:id)

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.ok) {
        toast.success(productId ? 'Product updated successfully!' : 'Product created successfully!');
        if (!productId) resetForm();
        else {
          // If updated, we might want to refresh details or go back
          fetchProductDetails(productId);
          setImages([]);
          setImagePreviews([]);
        }
      } else {
        toast.error(data.message || `Failed to ${productId ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = () => {
    const mrp = parseFloat(formData['price.mrp']) || 0;
    const selling = parseFloat(formData['price.selling_price']) || 0;
    if (mrp > 0 && selling > 0) {
      const discount = ((mrp - selling) / mrp) * 100;
      return discount.toFixed(2);
    }
    return 0;
  };

  return (
    <div className="h-screen overflow-y-auto w-full overflow-x-auto">
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
  <div className="flex gap-4 min-w-max"> 
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Create Product | Product Management</title>
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">{productId ? 'Edit Product' : 'Create New Product'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/products')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
     

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Required</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Will be auto-generated if empty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Dry Fruits">Dry Fruits</option>
                    <option value="Spices">Spices</option>
                    <option value="Grains">Grains</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dairy">Dairy</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      name="sub_category"
                      value={formData.sub_category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Almonds"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., NutriFarm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Images</h2>
            
            <div className="space-y-6">
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Existing Images ({existingImages.length}/5)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={img.url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Note: To remove existing images, please contact support or use the image management tool (coming soon).</p>
                </div>
              )}

              <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">Click to upload images</p>
                    <p className="text-sm text-gray-500">Upload up to 5 images (PNG, JPG, GIF up to 5MB)</p>
                    <p className="text-xs text-gray-400 mt-2">Images uploaded: {images.length}/5</p>
                  </div>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview ({images.length} images)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to remove
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  MRP (Maximum Retail Price) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price.mrp"
                    value={formData['price.mrp']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Price *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price.selling_price"
                    value={formData['price.selling_price']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Percent
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price.discount_percent"
                      value={formData['price.discount_percent'] || calculateDiscount()}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Auto-calculated"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">%</span>
                    </div>
                  </div>
                </div>
                
                {formData['price.mrp'] && formData['price.selling_price'] && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">You save: 
                      <span className="font-bold text-green-600 ml-1">
                        ₹{(parseFloat(formData['price.mrp']) - parseFloat(formData['price.selling_price'])).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quantity & Inventory */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quantity & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quantity Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Quantity Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="quantity_info.unit"
                    value={formData['quantity_info.unit']}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select unit</option>
                    <option value="grams">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="piece">Piece</option>
                    <option value="pack">Pack</option>
                    <option value="bottle">Bottle</option>
                    <option value="box">Box</option>
                    <option value="dozen">Dozen</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size/Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity_info.size"
                    value={formData['quantity_info.size']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              {/* Inventory Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Inventory Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Stock Available *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData['inventory.stock_available'] === true ? 'border-green-500' : 'border-gray-300'}`}>
                        {formData['inventory.stock_available'] === true && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="inventory.stock_available"
                        value="true"
                        checked={formData['inventory.stock_available'] === true}
                        onChange={() => setFormData(prev => ({ ...prev, 'inventory.stock_available': true }))}
                        className="hidden"
                      />
                      <span className="text-gray-700 font-medium">In Stock</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData['inventory.stock_available'] === false ? 'border-red-500' : 'border-gray-300'}`}>
                        {formData['inventory.stock_available'] === false && (
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="inventory.stock_available"
                        value="false"
                        checked={formData['inventory.stock_available'] === false}
                        onChange={() => setFormData(prev => ({ ...prev, 'inventory.stock_available': false }))}
                        className="hidden"
                      />
                      <span className="text-gray-700 font-medium">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="inventory.stock_quantity"
                    value={formData['inventory.stock_quantity']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter available quantity"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor ID *
                </label>
                <input
                  type="text"
                  name="vendor.vendor_id"
                  value={formData['vendor.vendor_id']}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., VEND001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  name="vendor.vendor_name"
                  value={formData['vendor.vendor_name']}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., NutriFarm Ltd"
                />
              </div>
            </div>
          </div>

          {/* Nutritional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nutritional Information</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Optional</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Calories (per serving)
                </label>
                <input
                  type="number"
                  name="nutritional_info.calories"
                  value={formData['nutritional_info.calories']}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 250"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Protein
                </label>
                <input
                  type="text"
                  name="nutritional_info.protein"
                  value={formData['nutritional_info.protein']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 20g"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fat
                </label>
                <input
                  type="text"
                  name="nutritional_info.fat"
                  value={formData['nutritional_info.fat']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10g"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Carbohydrates
                </label>
                <input
                  type="text"
                  name="nutritional_info.carbohydrates"
                  value={formData['nutritional_info.carbohydrates']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 30g"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fiber
                </label>
                <input
                  type="text"
                  name="nutritional_info.fiber"
                  value={formData['nutritional_info.fiber']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5g"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Details
                </label>
                <input
                  type="text"
                  name="nutritional_info.other_details"
                  value={formData['nutritional_info.other_details']}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional info"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., organic, vegan, gluten-free"
                />
                <p className="mt-2 text-sm text-gray-500">Separate multiple tags with commas</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shelf Life
                </label>
                <input
                  type="text"
                  name="shelf_life"
                  value={formData.shelf_life}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 12 months"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {productId ? 'Updating Product...' : 'Creating Product...'}
                    </span>
                  ) : (productId ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

    
    </div>

    </div>
    </div>
  );
}

export default function CreateProduct() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProductFormContent />
    </Suspense>
  );
}