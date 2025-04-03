// src/pages/profile/Profile.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Cashier",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // For profile picture preview
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to update the user information
      // updateUser({ name: formData.fullName, email: formData.email, phone: formData.phone, avatar });

      // For the demo, we'll just simulate a successful update
      setTimeout(() => {
        enqueueSnackbar("Profile information updated successfully", {
          variant: "success",
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      enqueueSnackbar("Failed to update profile information", {
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      enqueueSnackbar("New passwords don't match", { variant: "error" });
      return;
    }

    if (formData.newPassword.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to change the password
      // await updatePassword(formData.currentPassword, formData.newPassword);

      // For the demo, we'll just simulate a successful update
      setTimeout(() => {
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
        });
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      enqueueSnackbar("Failed to change password", { variant: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with profile summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {user?.name || "User Name"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {user?.email || "user@example.com"}
              </p>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-xs font-medium">
                {user?.role || "Cashier"}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === "personal"
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <User size={18} className="mr-2" />
                Personal Information
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === "password"
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Key size={18} className="mr-2" />
                Change Password
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield size={18} />
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-xs">
                    Active since{" "}
                    {new Date(
                      user?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Personal Information Form */}
            {activeTab === "personal" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Personal Information
                </h2>

                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="pl-10 bg-gray-50 dark:bg-gray-700"
                          required
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 bg-gray-50 dark:bg-gray-700"
                          required
                        />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10 bg-gray-50 dark:bg-gray-700"
                        />
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Used for account recovery and notifications
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Role
                      </label>
                      <div className="relative">
                        <input
                          id="role"
                          value={formData.role}
                          className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 cursor-not-allowed"
                          disabled
                        />
                        <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Your role can only be changed by an administrator
                      </p>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {activeTab === "password" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Change Password
                </h2>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-gray-50 dark:bg-gray-700"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Key size={18} className="mr-2" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle2
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Successful login
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Today at 10:30 AM • IP: 192.168.1.1
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <User
                      size={16}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Profile information updated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Yesterday at 3:45 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <AlertCircle
                      size={16}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Password changed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    June 5, 2023 at 11:20 AM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
