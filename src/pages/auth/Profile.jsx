import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Save, X, Edit2 } from "lucide-react";
import Card from "../../components/Card";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/thunks/authThunk";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { logout } from "../../redux/features/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { user } = useSelector((state) => state.auth);

  const [isEditingUsername, setEditingUsername] = useState(false);
  const [isEditingPassword, setEditingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State for modal

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate and submit username change
  const handleUsernameSubmit = async () => {
    try {
      if (!formData.username.trim()) {
        setErrors({ username: "Username is required" });
        return;
      }

      dispatch(updateUser({ username: formData.username }));
      console.log("Updating username to:", formData.username);
      setEditingUsername(false);
      setErrors({});
    } catch (error) {
      setErrors({ username: error.message || "Failed to update username" });
    }
  };

  // Validate and submit password change
  const handlePasswordSubmit = async () => {
    try {
      const newErrors = {};
      if (!formData.oldPassword) {
        newErrors.oldPassword = "Current password is required";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      dispatch(
        updateUser({
          old_password: formData.oldPassword,
          password: formData.newPassword,
        })
      );

      console.log("Updating password");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
      setEditingPassword(false);
      setErrors({});
    } catch (error) {
      setErrors({
        passwordError: error.message || "Failed to update password",
      });
    }
  };

  // Handle cancel editing
  const handleCancelEdit = (type) => {
    if (type === "username") {
      setEditingUsername(false);
      setFormData((prev) => ({
        ...prev,
        username: user?.username || "",
      }));
    } else {
      setEditingPassword(false);
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    }
    setErrors({});
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page
  };

  return (
    <Card className="w-1/3">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>

      {/* Username Section */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          {isEditingUsername ? (
            <>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="New Username"
                isInvalid={!!errors.username}
                errorMessage={errors.username}
                className="flex-1 bg-gray-700 text-white"
              />
              <Button
                isIconOnly
                color="success"
                size="sm"
                onClick={handleUsernameSubmit}
                className="min-w-unit-10"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                color="error"
                size="sm"
                onClick={() => handleCancelEdit("username")}
                className="min-w-unit-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="flex-1 text-lg">{user?.username || ""}</span>
              <Button
                isIconOnly
                color="default"
                size="sm"
                onClick={() => {
                  setEditingUsername(true);
                  setEditingPassword(false);
                }}
                className="min-w-unit-10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <Button
          color={isEditingPassword ? "error" : "primary"}
          onClick={() => {
            setEditingPassword(!isEditingPassword);
            setEditingUsername(false);
            setErrors({});
          }}
          className="w-full"
        >
          {isEditingPassword ? "Cancel" : "Change Password"}
        </Button>

        {isEditingPassword && (
          <div className="space-y-4">
            <Input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              placeholder="Current Password"
              isInvalid={!!errors.oldPassword}
              errorMessage={errors.oldPassword}
              className="bg-gray-700 text-white"
            />

            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword}
              className="bg-gray-700 text-white"
            />

            {errors.passwordError && (
              <div className="text-red-500 text-sm">{errors.passwordError}</div>
            )}

            <div className="flex gap-2">
              <Button
                isIconOnly
                color="success"
                onClick={handlePasswordSubmit}
                className="min-w-unit-10"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                color="error"
                onClick={() => handleCancelEdit("password")}
                className="min-w-unit-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <Button
          color="error"
          onClick={() => setConfirmModalOpen(true)} // Open confirmation modal
          className="w-full"
        >
          Logout
        </Button>
      </div>
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <ModalContent className="bg-gray-800 text-white">
          <ModalHeader>Logout Confirmation</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end mt-4">
              <Button
                color="danger"
                onClick={() => {
                  handleLogout(); // Call logout function
                  setConfirmModalOpen(false); // Close modal
                }}
              >
                Logout
              </Button>
              <Button
                color="default"
                onClick={() => setConfirmModalOpen(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default Profile;
