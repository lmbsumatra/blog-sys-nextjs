interface InputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
    type: string;
    id: string;
    placeholder: string;
    value: string;
    hasErrors: boolean;
    error: string;
  }
  
  const Input: React.FC<InputProps> = ({
    name = "",
    label = "",
    type = "",
    id = "",
    placeholder = "",
    value = "",
    hasErrors = false,
    error = "",
    onChange,
  }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{label}</label>
        <input
          value={value}
          name={name}
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange} 
          className="w-full px-3 py-2 border rounded-lg"
        />
        {hasErrors && <span className="text-red-500">{error}</span>}
      </div>
    );
  };
  
  export default Input;
  