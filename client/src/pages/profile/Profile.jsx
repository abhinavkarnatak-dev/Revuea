import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Button from "../../components/layout/Button";
import { motion } from "motion/react";

const Profile = () => {
  const { token, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
      setNewName(res.data.data.name);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newName.trim()) return toast.error("Name cannot be empty");

    try {
      const res = await axios.patch(
        "/api/user/update",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Name updated!");
      setProfile(res.data.data);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
    } catch {
      toast.error("Failed to update name");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <p className="w-screen h-screen bg-[#0a0b10] flex justify-center items-center text-gray-400 font-outfit-500">
        Loading...
      </p>
    );
  }

  if (!profile) {
    return <p className="text-center text-red-500">Profile not found</p>;
  }

  return (
    <motion.div className="w-screen h-screen bg-[#0a0b10] p-6 shadow-lg text-white font-outfit-400 flex flex-col items-center relative overflow-hidden">
      <motion.h1
        className="text-lg md:text-2xl lg:text-4xl font-outfit-600 mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        My Profile
      </motion.h1>

      <motion.div
        className="w-[80%] h-80 bg-[#0f111a] rounded-lg p-10 mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="mb-4">
          <div className="mb-4">
            <label className="text-xs md:text-sm text-gray-400">Name</label>
            {editMode ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none text-xs md:text-sm lg:text-base"
              />
            ) : (
              <p className="text-xs md:text-sm lg:text-base">{profile.name}</p>
            )}
          </div>
          <label className="text-xs md:text-sm text-gray-400">Email</label>
          <p className="text-xs md:text-sm lg:text-base">{profile.email}</p>
        </div>

        {editMode ? (
          <div className="flex gap-3">
            <Button
              variant="green"
              width="w-18 md:w-23 lg:w-24"
              marTop="mt-5"
              onClick={handleUpdate}
            >
              Save
            </Button>
            <Button
              variant="cancel"
              width="w-12 md:w-16 lg:w-20 "
              marTop="mt-5"
              onClick={() => {
                setEditMode(false);
                setNewName(profile.name);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-row gap-3">
            <Button
              width="w-18 md:w-23 lg:w-24"
              marTop="mt-5"
              onClick={() => setEditMode(true)}
            >
              Edit Name
            </Button>

            <a href="/dashboard">
              <Button
                variant="white"
                width="w-12 md:w-16 lg:w-20"
                marTop="mt-5"
              >
                Back
              </Button>
            </a>
          </div>
        )}
      </motion.div>
      <div className="absolute -bottom-[16rem] z-[20] size-[24rem] overflow-hidden rounded-full bg-gradient-to-t from-purple-400 to-purple-700 blur-[16em]"></div>
    </motion.div>
  );
};

export default Profile;