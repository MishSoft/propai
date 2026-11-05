interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormInput = ({ label, name, type = "text", placeholder, required, value, onChange }: Props) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-25"
      />
    ) : (
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    )}
  </div>
);
