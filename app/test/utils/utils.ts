// utils.ts
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

// ✅ Validate STL file format
export function validateSTL(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    if (!file || !file.name.toLowerCase().endsWith(".stl")) {
      console.error("Invalid file extension");
      return resolve(false);
    }

    const validMimeTypes = ["model/stl", "application/vnd.ms-pki.stl"];
    if (file.type && !validMimeTypes.includes(file.type)) {
      console.error("Invalid MIME type");
      return resolve(false);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const dataView = new DataView(buffer);
        const headerString = new TextDecoder()
          .decode(buffer.slice(0, 5))
          .toLowerCase();

        if (headerString === "solid") {
          resolve(true);
        } else {
          if (buffer.byteLength < 84) {
            console.error("File is too small for a binary STL.");
            return resolve(false);
          }

          const numTriangles = dataView.getUint32(80, true);
          const expectedSize = 84 + numTriangles * 50;
          if (dataView.byteLength >= expectedSize) {
            resolve(true);
          } else {
            console.error("Binary STL file size is smaller than expected.");
            resolve(false);
          }
        }
      } catch (error) {
        console.error("Error reading file:", error);
        resolve(false);
      }
    };
    reader.onerror = () => {
      console.error("FileReader error");
      resolve(false);
    };

    reader.readAsArrayBuffer(file);
  });
}

// ✅ Calculate weight and cost
export function calculateWeight(
  volume: number,
  material: string,
  densities: Record<string, number>
): number | false {
  const key = Object.keys(densities).find(
    (k) => k.toLowerCase() === material.toLowerCase()
  );
  const materialDensity = key ? densities[key] : 0;
  if (!materialDensity) {
    console.error(`Density for "${material}" not found`);
    return false;
  }
  return volume * materialDensity;
}

export function calculateCost(
  volume: number,
  material: string,
  prices: Record<string, number>,
  densities: Record<string, number>
): [number, number] | false {
  const key = Object.keys(prices).find(
    (k) => k.toLowerCase() === material.toLowerCase()
  );
  const materialPrice = key ? prices[key] : 0;
  if (!materialPrice) {
    console.error(`Price for "${material}" not found`);
    return false;
  }

  const weight = calculateWeight(volume, material, densities);
  if (!weight) return false;

  return [weight, weight * materialPrice];
}

export function calculateTotalPrice(
  unitPrice: number,
  quantity: number
): number {
  if (!quantity || quantity < 1) return NaN;
  return unitPrice * quantity;
}

// ✅ 3D Geometry and Volume Calculation
export async function getGeometry(file: File): Promise<THREE.BufferGeometry> {
  const url = URL.createObjectURL(file);
  const loader = new STLLoader();

  const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });

  URL.revokeObjectURL(url);
  return geometry;
}

export async function computeMeshVolume(file: File): Promise<number> {
  const geometry = await getGeometry(file);
  const geom = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = geom.attributes.position;
  let volume = 0;

  for (let i = 0; i < position.count; i += 3) {
    const p1 = new THREE.Vector3().fromBufferAttribute(position, i);
    const p2 = new THREE.Vector3().fromBufferAttribute(position, i + 1);
    const p3 = new THREE.Vector3().fromBufferAttribute(position, i + 2);
    volume += p1.dot(p2.clone().cross(p3)) / 6.0;
  }

  return Math.abs(volume / 1000); // Convert mm³ → cm³
}

// ✅ Upload helpers
export async function uploadFiles(files: File[]): Promise<string[]> {
  const newUrls: string[] = [];
  const sigResponse = await getUploadSignature();
  if (!sigResponse) return newUrls;

  for (const file of files) {
    try {
      const response = await uploadFileToCloudinary(file, sigResponse);
      if (response.secure_url) {
        newUrls.push(response.secure_url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return newUrls;
}

async function uploadFileToCloudinary(
  file: File,
  signatureData: any
): Promise<any> {
  const { folder, signature, timestamp, cloud_name, api_key } = signatureData;
  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

  const formData = new FormData();
  formData.append("folder", folder);
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();
  return data;
}

async function getUploadSignature() {
  try {
    const response = await fetch(`/api/upload/signature`, {
      method: "POST",
      body: JSON.stringify({ folder: generateRandomSequence() }),
    });
    if (!response.ok) throw new Error("Failed to get upload signature");
    return await response.json();
  } catch (error) {
    console.error("Failed to get upload signature:", error);
    return null;
  }
}

// ✅ Misc Helpers
export function generateRandomSequence(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function handleLongFileName(
  fileName: string,
  maxLength = 30
): string {
  const parts = fileName.split(".");
  const extension = parts.pop();
  const base = parts.join(".");
  if (base.length > maxLength) {
    return `${base.slice(0, maxLength / 2)}...${base.slice(
      -maxLength / 2
    )}.${extension}`;
  }
  return fileName;
}
