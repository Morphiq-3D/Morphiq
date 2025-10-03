"use client";
import { useState } from "react";

export default function DesignRequestForm() {
    const [formData, setFormData] = useState({
        description: "",
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Your request has been submitted! We will contact you soon.");
        setFormData({
            description: "",
            name: "",
            email: "",
            phone: "",
            whatsapp: "",
        });
    };

    return (
        <section id="request" className="custom-request py-[50px] px-[20px] mt-[20px] rounded-[12px]">

            {/* text-gray-100 */}
            <div className="w-full mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
                Have a 3D idea ?
            </h2>
            <p>Get in touch to turn this idea into reality!</p>
            </div>

            <form className="custom-request-container flex flex-wrap gap-6 max-w-[1000px] mx-auto my-0" onSubmit={handleSubmit}>
                {/* Left - Contact Info */}
                <div className="custom-form flex-1 min-w-[280px] flex flex-col gap-4">
                    <label className="form-label">
                        Name:
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Email:
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Phone:
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        WhatsApp:
                        <input
                            type="tel"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            placeholder="WhatsApp Number"
                            className="form-input"
                        />
                    </label>
                </div>

                {/* Right - Description + Button */}
                <div className="custom-description flex-1 min-w-[280px] flex flex-col gap-4">
                    <label className="font-medium" htmlFor="description">Describe your idea:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe the object you want us to print..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full h-[200px] p-4 size-4 border border-[#ddd] rounded-lg resize-y"
                    />
                    <button type="submit" className="w-full h-10 self-center px-4 bg-[#0073e6] text-white border-none rounded-lg cursor-pointer size-4 mt-3 transition-colors duration-[3s] hover:bg-[#005bb5]">Submit Request</button>
                </div>
            </form>
        </section>
    );
}