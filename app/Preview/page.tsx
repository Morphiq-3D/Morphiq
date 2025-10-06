"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as utils from "./utils/utils"; 
import { useFileContext } from "../context/FileContext";
import { useRouter } from "next/navigation";

const MATERIAL_PRICES: Record<string, number> = {
  PLA: 0.15,
  ABS: 0.15,
  PETG: 0.15,
};

const MATERIAL_DENSITIES: Record<string, number> = {
  PLA: 1.24,
  ABS: 1.04,
  PETG: 1.27,
};

type UploadedFile = {
  id: string;
  file: File;
  name: string;
  volume: number;
  material: string;
  weight: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

function Model({ file, col = "gray" }: { file?: File | null; col?: string }) {
  const [geometry, setGeometry] = useState<any | null>(null);

  useEffect(() => {
    if (!file) return;
    let mounted = true;

    utils.getGeometry(file)
      .then((geo: any) => {
        if (!mounted) return;
        geo.center();
        setGeometry(geo);
      })
      .catch((err: any) => console.error("getGeometry error:", err));

    return () => { mounted = false; };
  }, [file]);

  if (!geometry) return null;

  return (
    <group scale={[0.03, 0.03, 0.03]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={col} />
      </mesh>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="black" linewidth={1} />
      </lineSegments>
    </group>
  );
}

export default function TestPage() {
  const router = useRouter();
  const { file } = useFileContext();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    governate: "",
    district: "",
    street: "",
    buildingNum: "",
    floor: "",
    apartment: "",
    phone: "",
  });

  useEffect(() => {
    const loadFileFromContext = async () => {
      if (file) {
        const formattedFile = await formatFile(file);
        setUploadedFiles([formattedFile]);
        setSelectedFileId(formattedFile.id);
      }
    };
    loadFileFromContext();
  }, [file]);

  useEffect(() => {
    const grandTotal = uploadedFiles.reduce((acc, f) => acc + (f?.totalPrice || 0), 0);
    setTotalPrice(grandTotal);
  }, [uploadedFiles]);

  const currentFile = uploadedFiles.find((f) => f.id === selectedFileId) || null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFiles = async (files: File[]) => {
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const isSTL = file.name.toLowerCase().endsWith(".stl");
          if (!isSTL) return null;
          const isValid = await utils.validateSTL(file);
          return isValid ? file : null;
        } catch { return null; }
      })
    );
    return results.filter(Boolean) as File[];
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;

    const stlFiles = await validateFiles(newFiles);
    if (stlFiles.length === 0) {
      setError("Please select only STL files.");
      setTimeout(() => { event.target.value = ""; }, 100);
      return;
    }

    const newProcessedFiles = await Promise.all(stlFiles.map((file) => formatFile(file)));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newProcessedFiles]);
    setSelectedFileId(newProcessedFiles[0].id);

    setTimeout(() => { event.target.value = ""; }, 100);
  };

  const formatFile = async (file: File): Promise<UploadedFile> => {
    const material = "PLA";
    const quantity = 1;
    const volume = await utils.computeMeshVolume(file); // keep for calculation
    const [weight, unitPrice] =
      (utils.calculateCost(volume, material, MATERIAL_PRICES, MATERIAL_DENSITIES) as [number, number]) || [0, 0];
    const totalPrice = utils.calculateTotalPrice(unitPrice, quantity);

    return {
      id: utils.generateRandomSequence(),
      file,
      name: utils.handleLongFileName(file.name),
      volume,
      material,
      weight,
      quantity,
      unitPrice,
      totalPrice,
    };
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    if (selectedFileId === id) setSelectedFileId(null);
  };

  const handleMaterialChange = (id: string, newMaterial: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === id) {
          const [newWeight, newPrice] =
            (utils.calculateCost(file.volume, newMaterial, MATERIAL_PRICES, MATERIAL_DENSITIES) as [number, number]) ||
            [0, 0];
          const newTotal = utils.calculateTotalPrice(newPrice, file.quantity);
          return { ...file, material: newMaterial, weight: newWeight, unitPrice: newPrice, totalPrice: newTotal };
        } else return file;
      })
    );
  };

  const handleQuantityChange = (id: string, newQuantity: number | string) => {
    const quantity = Math.max(1, parseInt(String(newQuantity), 10) || 1);
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === id) {
          const newTotal = utils.calculateTotalPrice(file.unitPrice, quantity);
          return { ...file, quantity, totalPrice: newTotal };
        } else return file;
      })
    );
  };

  const handleFileSelect = (id: string) => setSelectedFileId(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = { contact: formData, files: uploadedFiles, grandTotal: totalPrice };
    console.log("Submitting order:", orderData);
    alert("Order submitted! See console for details.");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">

        {/* LEFT COLUMN */}
        <div className="flex flex-col space-y-6">

          {/* 3D Viewer + File Details */}
          <div className="bg-gray-800 rounded-2xl shadow-md p-4 lg:p-6 h-[85vh] overflow-hidden flex flex-col">
            <div className="flex-1 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
              {selectedFileId ? (
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full">
                  <ambientLight intensity={1.5} />
                  <directionalLight intensity={0.8} position={[0, 0, 5]} />
                  <pointLight position={[10, 10, 10]} />
                  <Suspense fallback={null}>
                    <Model key={currentFile?.id} file={currentFile?.file} col={"gray"} />
                  </Suspense>
                  <OrbitControls />
                </Canvas>
              ) : (
                <p className="text-lg font-semibold text-slate-700">No STL file uploaded</p>
              )}
            </div>

            {currentFile && (
              <div className="w-full mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 text-white">
                <p className="text-2xl font-semibold mb-3 truncate">{currentFile.name}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-black text-white rounded-lg px-3 py-2 text-sm">
                    <div className="font-semibold">Weight</div>
                    <div>{currentFile.weight.toFixed(2)} g</div>
                  </div>
                  <div className="bg-black text-white rounded-lg px-3 py-2 text-sm">
                    <div className="font-semibold">Material</div>
                    <select
                      value={currentFile.material}
                      onChange={(e) => handleMaterialChange(currentFile.id, e.target.value)}
                      className="bg-white text-black rounded px-2 py-1 outline-none"
                    >
                      {Object.keys(MATERIAL_PRICES).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-black text-white rounded-lg px-3 py-2 text-sm">
                    <div className="font-semibold">Quantity</div>
                    <input
                      type="number"
                      value={currentFile.quantity}
                      onChange={(e) => handleQuantityChange(currentFile.id, e.target.value)}
                      min={1}
                      className="w-20 bg-white text-black rounded px-2 py-1 outline-none"
                    />
                  </div>
                  <div className="bg-black text-white rounded-lg px-3 py-2 text-sm">
                    <div className="font-semibold">Unit Price</div>
                    <div>{currentFile.unitPrice.toFixed(2)}$</div>
                  </div>
                  <div className="bg-black text-white rounded-lg px-3 py-2 text-sm">
                    <div className="font-semibold">Total Price</div>
                    <div>{currentFile.totalPrice.toFixed(2)}$</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT FORM */}
          <div className="bg-gray-800 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-cyan-400">
              Contact & Delivery
            </h2>

            <form className="flex flex-col gap-3 text-white" onSubmit={handleSubmit}>
              <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  required
  className="p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

<div className="flex flex-wrap gap-3">
  <input
    type="text"
    name="firstName"
    placeholder="First Name"
    value={formData.firstName}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="text"
    name="lastName"
    placeholder="Last Name"
    value={formData.lastName}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

<div className="flex flex-wrap gap-3">
  <input
    type="text"
    name="country"
    placeholder="Country"
    value={formData.country}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="text"
    name="governate"
    placeholder="Governate"
    value={formData.governate}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

<div className="flex flex-wrap gap-3">
  <input
    type="text"
    name="district"
    placeholder="District"
    value={formData.district}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="text"
    name="street"
    placeholder="Street"
    value={formData.street}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

<div className="flex flex-wrap gap-3">
  <input
    type="text"
    name="buildingNum"
    placeholder="Building Number"
    value={formData.buildingNum}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="text"
    name="floor"
    placeholder="Floor"
    value={formData.floor}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <input
    type="text"
    name="apartment"
    placeholder="Apartment"
    value={formData.apartment}
    onChange={handleChange}
    required
    className="flex-1 min-w-0 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

<input
  type="tel"
  name="phone"
  placeholder="Phone"
  value={formData.phone}
  onChange={handleChange}
  required
  className="p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>


              {/* Submit + Return Home */}
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-cyan-400 hover:scale-96 duration-300 "
                >
                  Submit Order
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-gray-500 hover:scale-96 duration-300"
                >
                  Return to Home
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-gray-800 rounded-2xl shadow-md p-6 text-center">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-cyan-400">
              STL File Customizer
            </h1>
            <p className="text-sm text-slate-500 mt-2">Add and customize your 3D models for printing.</p>

            <label
              htmlFor="file-upload"
              className="mt-6 inline-flex cursor-pointer flex-col items-center gap-2 border-2 border-slate-400 border-dashed rounded-lg px-6 py-6 hover:border-blue-400 transition"
            >
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".stl"
                className="hidden"
              />
              <CloudArrowUpIcon className="h-12 w-12 text-slate-400" />
              <span className="font-medium text-slate-600">Click to select files</span>
              <span className="text-sm text-slate-400">(Only .stl files are accepted)</span>
            </label>

            {error && <div className="mt-4 p-3 bg-red-700/90 text-red-100 rounded">{error}</div>}
          </div>

          {/* Files List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-gray-800 rounded-2xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Your Files</h2>
              <div className="flex flex-col gap-4">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gray-700 shadow-sm cursor-pointer border-2 ${
                      selectedFileId === file.id ? "border-blue-400" : "border-transparent"
                    }`}
                    onClick={() => handleFileSelect(file.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{file.name}</div>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFile(file.id); }}
                        aria-label="Remove file"
                        className="text-slate-500 hover:text-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gray-700 shadow-inner flex items-center justify-between font-bold text-lg bg-gradient-to-br from-blue-600 to-cyan-400">
                <span className="text-white">Grand Total Price:</span>
                <span className="bg-clip-text text-white bg-gradient-to-br ">
                  {totalPrice.toFixed(2)}$
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
