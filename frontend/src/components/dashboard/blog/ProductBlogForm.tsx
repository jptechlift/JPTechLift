export interface ProductDetails {
  productName: string;
  productType: string;
}

import { FieldError } from "react-hook-form";

interface Props {
  details: ProductDetails;
  setDetails: (details: ProductDetails) => void;
  error?: FieldError;
  disabled?: boolean;
}

export default function ProductBlogForm({ details, setDetails, error, disabled }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          id="productName"
          type="text"
          value={details.productName}
          onChange={(e) => setDetails({ ...details, productName: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
      <div>
        <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type</label>
        <input
          id="productType"
          type="text"
          value={details.productType}
          onChange={(e) => setDetails({ ...details, productType: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}