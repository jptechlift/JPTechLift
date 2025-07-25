const ElevatorConsultation = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tư Vấn Thiết Kế Thang Máy
        </h1>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-12 h-1 bg-orange-500"></div>
          <div className="flex space-x-1">
            <span className="text-orange-500">★</span>
            <span className="text-orange-500">★</span>
            <span className="text-orange-500">★</span>
          </div>
          <div className="w-12 h-1 bg-orange-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed mb-6">
          Tư vấn thiết kế thang máy là bước khởi đầu và là khâu đặc biệt quan
          trọng để tạo nên một sản phẩm hoàn chỉnh, đáp ứng nhu cầu sử dụng và
          thẩm mỹ của khách hàng. Thang máy JP TechLift, với đội ngũ nhân viên
          chuyên nghiệp và giàu kinh nghiệm, sẽ hỗ trợ tư vấn cho khách hàng lựa
          chọn sản phẩm thang máy tối ưu: phù hợp với công năng sử dụng,
          đảm bảo an toàn, có tính thẩm mỹ cao, tích hợp tính năng thông minh và
          tối ưu chi phí.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Trước khi triển khai thiết kế thang máy mới, Thang máy JP TechLift sẽ:
          <br />
          Tìm hiểu nhu cầu và mong muốn của khách hàng
          <br />
          Khảo sát hiện trạng công trình thực tế
          <br />
          Đề xuất phương án lắp đặt thang máy phù hợp
          <br />
          Tư vấn thiết kế 3D để hài hòa với kiến trúc tổng thể và tối ưu công
          năng sử dụng.
        </p>

        <h2 className="text-gray-700 leading-relaxed mb-8">
          Những hạng mục trong quá trình thiết kế thang máy bao gồm:
        </h2>
      </div>

      {/* Section 1 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          1. Thiết kế giếng thang – Hệ thang máy
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Giếng thang là không gian trục di chuyển của hệ thang, nơi cabin
              thang máy hoạt động và vận hành ổn định theo nhu cầu sử dụng.
              Trong thiết kế giếng thang, việc tạo hố thang đủ sâu và cao phải
              đảm bảo không gây cản trở đến thiết kế, xây dựng, và tuân thủ đúng
              theo hướng dẫn kỹ thuật.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Hệ thang máy bao gồm toàn bộ thiết bị cơ khí và điện liên quan đến
              vận hành thang máy. Đây là phần quan trọng của giếng thang, ảnh
              hưởng trực tiếp đến an toàn và hiệu suất hoạt động. Hệ thang cần
              được thiết kế chắc chắn, đúng kỹ thuật, và đảm bảo khả năng chịu
              lực, cách âm, cách nhiệt và bảo trì dễ dàng. Có thể liên kết hệ
              thang máy với các cấu trúc khác bằng các liên kết cơ khí chuyên
              dụng.
            </p>
          </div>

          <div className="space-y-4">
            {/* Technical Drawing */}
            <div className="border border-gray-300 p-4 bg-gray-50">
              <div className="text-center text-sm text-gray-600 mb-2">
                SƠ ĐỒ PIT 200×200
              </div>
              <div className="border-2 border-dashed border-gray-400 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold">1F</div>
                  <div className="text-sm">PIT</div>
                  <div className="text-xs">R₀ R₁</div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                ĐÁY PIT PHẢI <br /> ĐẢM BẢO KHỐI ĐỘ
              </div>
            </div>

            <div className="text-center">
              <div className="text-orange-500 text-lg">DELTA ELEVATOR</div>
              <div className="text-xs text-gray-500">
                Thiết kế hố thang đảm bảo khối cấu kiện
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Drawing 2 */}
      <div className="mb-8 text-center">
        <div className="inline-block border border-gray-300 p-4">
          <div className="w-64 h-32 border border-gray-400 flex items-center justify-center">
            <div className="text-sm text-gray-600">Mặt cắt cấu tạo hố thang máy</div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          2. Thiết kế hệ điều khiển thang máy
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Khi xây dựng hệ thống thang máy, cần xác định rõ yêu cầu kỹ thuật,
          lưu lượng di chuyển, tải trọng và mong muốn của khách hàng. Thang máy
          JP TechLift sẽ hỗ trợ khách hàng cấu hình và thiết kế hệ điều khiển
          tối ưu, phù hợp với nhu cầu thực tế sử dụng.
        </p>
      </div>

      {/* Section 3 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          3. Thiết kế phòng máy
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Phòng máy, hay còn gọi là phòng kỹ thuật, là nơi đặt máy kéo, tủ điều
          khiển và các bộ khống chế vận hành. Tùy vào loại thang máy, có thể bố
          trí phòng máy phía trên giếng thang hoặc phía sau hố thang để thuận
          tiện cho bảo trì và tiết kiệm diện tích.
        </p>
      </div>

      {/* Image Section */}
      <div className="mb-8 text-center">
        <div className="inline-block">
          <img
            src="/api/placeholder/600/200"
            alt="Phòng máy thang tải hàng"
            className="w-full h-48 object-cover border border-gray-300"
          />
          <div className="text-sm text-gray-600 mt-2">
            Phòng máy thang tải hàng
          </div>
        </div>
      </div>

      {/* Final Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          4. Tư vấn thiết kế trang trí nội thất
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Thang máy ngày nay không chỉ phục vụ mục đích di chuyển mà còn là một
          phần của thiết kế nội thất, thể hiện sự sang trọng và hiện đại của công
          trình. Đối với các công trình không có phòng máy, có thể sử dụng thiết
          kế thang máy không phòng máy để tạo sự linh hoạt trong kiến trúc và
          tiết kiệm không gian.
        </p>
      </div>
    </div>
  );
};
export default ElevatorConsultation;
