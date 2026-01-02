"use client"

import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, CreditCard, Building2, Edit2, Trash2, Save, X, AlertTriangle, Mail, Shield } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`}>
      {message}
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, profileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Profile?</h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{profileName}</span>'s profile? This action cannot be undone and all data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileAvatar = ({ name, photo }) => {
  if (photo && photo !== 'https://example.com/uploads/admin-profile.jpg') {
    return (
      <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
    );
  }
  
  const initial = name ? name.charAt(0).toUpperCase() : 'A';
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#853EFD] to-[#6B2FD8] flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
      {initial}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, editable, isEditing, onChange, name, type = "text" }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#853EFD] transition-all hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-purple-50 rounded-lg">
        <Icon className="w-5 h-5 text-[#853EFD]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {isEditing && editable ? (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#853EFD] focus:border-transparent text-sm"
          />
        ) : (
          <p className="text-gray-900 font-medium break-words">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  </div>
);

export default function AdminProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`https://api.keeva.in${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/partner/profile/me');
      if (data.ok) {
        setProfileData(data.partner);
        setEditedData(data.partner);
      }
    } catch (error) {
      showToast('Failed to fetch profile', 'error');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await apiCall(`/partner/${profileData._id}`, {
        method: 'PUT',
        body: JSON.stringify(editedData),
      });
      
      if (response.ok) {
        setProfileData(response.partner || editedData);
        setIsEditing(false);
        showToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update profile', 'error');
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiCall(`/partner/${profileData._id}`, {
        method: 'DELETE',
      });
      
      showToast('Profile deleted successfully', 'success');
      setShowDeleteModal(false);
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      showToast('Failed to delete profile', 'error');
      console.error('Error deleting profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#853EFD] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No profile data available</p>
        </div>
      </div>
    );
  }

  const isAdmin = profileData.role === 'admin';
  const data = isEditing ? editedData : profileData;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 overflow-hidden flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DeleteModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDeleteConfirm}
        profileName={data.full_name}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          {/* Header with Gradient Background */}
          <div className="bg-gradient-to-r from-[#853EFD] to-[#6B2FD8] rounded-2xl shadow-xl p-6 sm:p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <ProfileAvatar name={data.full_name} photo={data.profile_photo} />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{data.full_name}</h1>
                  <p className="text-purple-100 text-lg mb-3">{data.role === 'admin' ? 'Administrator' : 'Partner'}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {data.is_active ? '● Active' : '● Inactive'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-black">
                      ID: {data._id?.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-5 py-3 bg-white text-[#853EFD] rounded-xl hover:bg-purple-50 transition font-medium shadow-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium shadow-lg"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-[#853EFD]" />
              </div>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard icon={Phone} label="Phone Number" value={data.phone_number} editable name="phone_number" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={Phone} label="Alternate Phone" value={data.alternate_phone_number} editable name="alternate_phone_number" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={Calendar} label="Date of Birth" value={data.date_of_birth} editable name="date_of_birth" type="date" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={User} label="Gender" value={data.gender} editable name="gender" isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-[#853EFD]" />
              </div>
              Address Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <InfoCard icon={MapPin} label="Full Address" value={data.address} editable name="address" isEditing={isEditing} onChange={handleChange} />
              </div>
              <InfoCard icon={MapPin} label="City" value={data.city} editable name="city" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={MapPin} label="State" value={data.state} editable name="state" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={MapPin} label="Pincode" value={data.pincode} editable name="pincode" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={MapPin} label="Area/Locality" value={data.area_locality} editable name="area_locality" isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-[#853EFD]" />
              </div>
              Banking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard icon={User} label="Account Holder Name" value={data.account_holder_name} editable name="account_holder_name" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={Building2} label="Bank Name" value={data.bank_name} editable name="bank_name" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={CreditCard} label="Account Number" value={data.account_number} editable name="account_number" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={CreditCard} label="IFSC Code" value={data.ifsc_code} editable name="ifsc_code" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={Mail} label="UPI ID" value={data.upi_id} editable name="upi_id" isEditing={isEditing} onChange={handleChange} />
              <InfoCard icon={CreditCard} label="PAN Card" value={data.pan_card ? '✓ Uploaded' : '✗ Not uploaded'} />
            </div>
          </div>

          {/* Vehicle & Work Details - Only for non-admin */}
          {!isAdmin && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-[#853EFD]" />
                </div>
                Work & Vehicle Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={User} label="Rider Type" value={data.rider_type} editable name="rider_type" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={Calendar} label="Working Shift" value={data.working_shift} editable name="working_shift" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={User} label="Emergency Contact Name" value={data.emergency_contact_name} editable name="emergency_contact_name" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={Phone} label="Emergency Contact Number" value={data.emergency_contact_number} editable name="emergency_contact_number" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={User} label="Vehicle Type" value={data.vehicle_type} editable name="vehicle_type" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={User} label="Vehicle Model" value={data.vehicle_model} editable name="vehicle_model" isEditing={isEditing} onChange={handleChange} />
                <InfoCard icon={CreditCard} label="Vehicle Number" value={data.vehicle_number} editable name="vehicle_number" isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-[#853EFD]" />
              </div>
              Document Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard icon={CreditCard} label="Aadhaar Front" value={data.aadhaar_front ? '✓ Uploaded' : '✗ Not uploaded'} />
              <InfoCard icon={CreditCard} label="Aadhaar Back" value={data.aadhaar_back ? '✓ Uploaded' : '✗ Not uploaded'} />
              {!isAdmin && (
                <>
                  <InfoCard icon={CreditCard} label="Driving License Front" value={data.driving_license_front ? '✓ Uploaded' : '✗ Not uploaded'} />
                  <InfoCard icon={CreditCard} label="Driving License Back" value={data.driving_license_back ? '✓ Uploaded' : '✗ Not uploaded'} />
                  <InfoCard icon={CreditCard} label="Vehicle RC" value={data.vehicle_rc ? '✓ Uploaded' : '✗ Not uploaded'} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #853EFD;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #6B2FD8;
        }
      `}</style>
    </div>
  );
}