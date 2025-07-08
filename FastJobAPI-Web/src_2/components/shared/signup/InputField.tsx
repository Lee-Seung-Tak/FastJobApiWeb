import React from 'react';
import Input from '../../../components/ui/Input';

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  extra?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label, name, placeholder, required, type = 'text', extra,
}) => (
  <div>
    <label className="block text-xs">
      <span className="text-white">{label}</span>
      {required && <span className="text-red-500 ml-1">*required</span>}
    </label>
    <Input name={name} placeholder={placeholder} type={type} />
    {extra}
  </div>
);

export default InputField;