import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  ImagePlus,
  MapPin,
  Landmark,
  FileText,
  LocateIcon,
} from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SelectLocation from "../../Map/SelectLocation";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [coordinates, setCoordinates] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error("Caption is required.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (!state) {
      toast.error("Please select a state.");
      return;
    }
    if (!landmark.trim()) {
      toast.error("Please enter a landmark.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter an address.");
      return;
    }
    if (!pincode.trim()) {
      toast.error("Please enter a pincode.");
      return;
    }
    if (!coordinates) {
      toast.error("Please select a location on the map.");
      return;
    }  

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("priority", priority);
    formData.append(
      "location",
      JSON.stringify({ state, landmark, address, pincode, coordinates })
    );    
    images.forEach((img) => formData.append("images", img));
    console.log("Form Data:", formData);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      toast.loading("Creating post...");
      await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/createPost`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.dismiss();
      toast.success("Post created successfully!");
      setCaption("");
      setImages([]);
      setState("");
      setLandmark("");
      setAddress("");
      setPincode("");
      setPriority("Medium");
      setCoordinates(null);
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-2xl mx-auto px-6 py-8 bg-white border border-gray-200 shadow-md rounded-xl mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="text-blue-600" size={22} />
          Create Civic Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700 font-medium">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe the issue..."
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none h-24"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <ImagePlus size={18} />
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Country
              </label>
              <input
                type="text"
                value="India"
                readOnly
                disabled
                className="w-full mt-1 p-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select State</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 font-medium flex items-center gap-1">
                <Landmark size={16} />
                Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                disabled={isSubmitting}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium flex items-center gap-1">
                <MapPin size={16} />
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 font-medium flex items-center gap-1">
                <LocateIcon size={16} />
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                disabled={isSubmitting}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Select Issue Location on Map
            </label>
            <div className="h-64 mt-2 rounded-md overflow-hidden border border-gray-300">
              <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SelectLocation onSelect={(latlng) => setCoordinates(latlng)} />
              </MapContainer>
            </div>
          </div>
          {coordinates && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Selected Coordinates: {coordinates.lat.toFixed(5)},{" "}
              {coordinates.lng.toFixed(5)}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 text-white font-medium py-2.5 rounded-md transition ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
