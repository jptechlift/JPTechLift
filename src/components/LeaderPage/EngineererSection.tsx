import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { engineerers, Engineer } from "../../data/EngineererData";

export default function LeaderSection() {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(
    null
  );

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEngineer(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="px-4 py-2 lg:px-24 bg-texture-bg bg-texture-pattern bg-[length:8px_8px]">
      {/* Tiêu đề */}
      <section className="text-[#041E42] w-full px-6 md:px-20 text-center md:pb-10">
        <h2
          className="md:mt-8 font-inter font-bold text-[36px] uppercase text-center mb-[30px]"
          data-aos="fade-up"
        >
          ĐỘI NGŨ KỸ SƯ
        </h2>
        <span
          className="block w-16 h-1 bg-[#CBA052] mx-auto mb-14 md:mb-10 rounded"
          data-aos="fade-up"
          data-aos-delay="100"
        />
      </section>

      {/* Danh sách kỹ sư */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 max-w-xl mx-auto mb-10 px-6">
        {engineerers.map((engineer, index) => (
          <div
            key={index}
            className="text-center cursor-pointer group"
            onClick={() => setSelectedEngineer(engineer)}
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
          >
            <div className="overflow-hidden rounded shadow transition group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={engineer.image}
                alt={engineer.name}
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="font-semibold text-[#041E42] mt-4">
              {engineer.name}
            </h3>
            <p className="text-sm text-[#041E42] mt-1">{engineer.title}</p>
            <div className="mt-4 h-0.5 bg-[#041E42] w-12 group-hover:w-full transition-all duration-300 mx-auto origin-left" />
          </div>
        ))}
      </div>

      {/* Modal chi tiết kỹ sư */}
      {selectedEngineer && (
        <div
          className="flex fixed inset-0 bg-black/40 backdrop-blur-sm items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEngineer(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl max-w-md w-[90%] relative shadow-2xl border border-gray-200 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 left-4 bg-[#0f172a] text-white text-sm font-bold px-3 py-1 rounded-full shadow">
              #{engineerers.findIndex((e) => e === selectedEngineer) + 1}
            </div>

            <button
              onClick={() => setSelectedEngineer(null)}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-2xl transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden border shadow-md">
              <img
                src={selectedEngineer.image}
                alt={selectedEngineer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              {selectedEngineer.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3 italic">
              {selectedEngineer.title}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
              {selectedEngineer.description}
            </p>

            {selectedEngineer.highlights?.length > 0 && (
              <>
                <p className="text-base font-medium text-gray-800 mt-6 mb-2">
                  Điểm nổi bật:
                </p>
                <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                  {selectedEngineer.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
