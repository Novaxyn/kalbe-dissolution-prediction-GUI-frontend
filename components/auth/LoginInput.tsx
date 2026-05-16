type LoginInputProps = {
    label: string,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LoginInput({
    label,
    type = "text",
    placeholder,
    value,
    onChange
}: LoginInputProps) {
    return(
        <div className="mb-5">
            <label className="block mb-2 text-sm text-white mb-2 tracking-wide">{label}</label>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 rounder-md bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-300 transition" 
            />
        </div>
    )
}