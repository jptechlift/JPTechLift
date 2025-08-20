export interface TopicDetails {
  topic: string;
  content: string;
}

interface Props {
  details: TopicDetails;
  setDetails: (details: TopicDetails) => void;
}

export default function TopicBlogForm({ details, setDetails }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Topic</label>
        <input
          type="text"
          value={details.topic}
          onChange={(e) => setDetails({ ...details, topic: e.target.value })}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={details.content}
          onChange={(e) => setDetails({ ...details, content: e.target.value })}
          className="mt-1 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
