"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FormInput } from "./FormInputs";
import { FormSelect } from "./FormSelect";
import { useToast } from "@/app/components/feedback/ToastProvider";

export default function ContactForm({ agentId }: { agentId: string }) {
  const t = useTranslations("ContactForm");
  const locale = useLocale();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    category: "Buy",
    propertyType: "Apartment",
    floor: "1",
    minRooms: "1",
    minBaths: "1",
    budget: "",
    description: "",
  });

  const floorOptions = Array.from({ length: 20 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      else toast.error(t("submission_failed"));
    } catch (err) {
      console.error(err);
      toast.error(t("submission_failed"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800">{t("success_title")}</h2>
        <p className="mt-2 text-gray-500">{t("success_message")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} lang={locale} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label={t("name_label")} name="name" required value={formData.name} onChange={handleChange} />
        <FormInput label={t("phone_label")} name="phone" required value={formData.phone} onChange={handleChange} />
      </div>

      <FormInput label={t("location_label")} name="location" placeholder={t("location_placeholder")} value={formData.location} onChange={handleChange} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          label={t("category_label")} name="category" value={formData.category}
          onChange={(value) => handleSelectChange("category", value)}
          options={[{ label: t("buy"), value: "Buy" }, { label: t("rent"), value: "Rent" }]}
        />
        <FormSelect
          label={t("property_type_label")} name="propertyType" value={formData.propertyType}
          onChange={(value) => handleSelectChange("propertyType", value)}
          options={[{ label: t("apartment"), value: "Apartment" }, { label: t("house"), value: "House" }]}
        />
        {/* სართულის არჩევანი */}
        <FormSelect
          label={t("floor_label")} name="floor" value={formData.floor}
          onChange={(value) => handleSelectChange("floor", value)}
          options={floorOptions}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormInput label={t("min_rooms_label")} name="minRooms" type="number" value={formData.minRooms} onChange={handleChange} />
        <FormInput label={t("min_baths_label")} name="minBaths" type="number" value={formData.minBaths} onChange={handleChange} />
        <FormInput label={t("budget_label")} name="budget" type="number" value={formData.budget} onChange={handleChange} required />
      </div>

      <FormInput label={t("description_label")} name="description" type="textarea" placeholder={t("description_placeholder")} value={formData.description} onChange={handleChange} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:bg-gray-400"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
