"use client";
import { useState } from "react";
import { FormInput } from "./FormInputs";
import { FormSelect } from "./FormSelect";

export default function ContactForm({ agentId }: { agentId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    category: "Buy",
    propertyType: "Apartment",
    minRooms: "1",
    minBaths: "1",
    budget: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/agent/${agentId}/contact`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) setSuccess(true);
      else alert("შეცდომა გაგზავნისას");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800">მონაცემები გაიგზავნა!</h2>
        <p className="text-gray-500 mt-2">მაკლერი მალე დაგიკავშირდებათ.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="თქვენი სახელი" name="name" required value={formData.name} onChange={handleChange} />
        <FormInput label="ტელეფონის ნომერი" name="phone" required value={formData.phone} onChange={handleChange} />
      </div>

      <FormInput label="სასურველი მდებარეობა" name="location" placeholder="მაგ: ვაკე, საბურთალო..." value={formData.location} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="გარიგება" name="category" value={formData.category} onChange={handleChange}
          options={[{ label: "ყიდვა", value: "Buy" }, { label: "ქირაობა", value: "Rent" }]}
        />
        <FormSelect
          label="ტიპი" name="propertyType" value={formData.propertyType} onChange={handleChange}
          options={[{ label: "ბინა", value: "Apartment" }, { label: "სახლი", value: "House" }]}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormInput label="მინ. ოთახი" name="minRooms" type="number" value={formData.minRooms} onChange={handleChange} />
        <FormInput label="მინ. სველი წერტილი" name="minBaths" type="number" value={formData.minBaths} onChange={handleChange} />
        <FormInput label="ბიუჯეტი ($)" name="budget" type="number" value={formData.budget} onChange={handleChange} />
      </div>

      <FormInput label="დამატებითი მოთხოვნები" name="description" type="textarea" placeholder="მაგ: დიდი აივანი, ხედი..." value={formData.description} onChange={handleChange} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:bg-gray-400"
      >
        {loading ? "იგზავნება..." : "მოთხოვნის გაგზავნა"}
      </button>
    </form>
  );
}
