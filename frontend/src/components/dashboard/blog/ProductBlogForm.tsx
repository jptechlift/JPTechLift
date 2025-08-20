export interface ProductDetails {
  productName: string;
  productType: string;
}

interface Props {
  details: ProductDetails;
  setDetails: (details: ProductDetails) => void;
}

export default function ProductBlogForm({ details, setDetails }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={details.productName}
          onChange={(e) => setDetails({ ...details, productName: e.target.value })}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Type</label>
        <input
          type="text"
          value={details.productType}
          onChange={(e) => setDetails({ ...details, productType: e.target.value })}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}