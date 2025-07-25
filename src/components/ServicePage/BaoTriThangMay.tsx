import serviceImg from "../../assets/images/product4.png"
const BaoTriThangMay = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header với breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 hidden">
        Trang chủ {'>'} Dịch vụ {'>'} Bảo Trì Bảo Dường Thang Máy
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Bảo Trì Bảo Dường Thang Máy
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </h1>

      {/* Tận tình - Tận tâm - Chuyên nghiệp */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-orange-500 mb-4">
          Tận tình – Tận tâm – Chuyên nghiệp
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Để đảm bảo cho việc sử dụng thang máy an toàn và an toàn, Công ty TNHH Thiết Bị và Thang Máy Delta luôn có chính sách bảo trì, bảo dưỡng theo định kỳ. Đây là khâu quan trọng góp phần kéo dài tuổi thọ sử dụng và vận hành ổn định thiết bị 24/7 của bạn đi cùng thời gian có thành phần định kỳ thường xuyên.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Dịch vụ bảo bảo trị, bảo dưỡng thang máy được thực hiện bởi đội ngũ kỹ thuật viên có tay nghề, tần tần, bản tình mạng đến cho khách hàng những trải nghiệm tốt nhất với số dụng tham phần tự dịch vụ của Delta.
        </p>
      </div>

      {/* Các dịch vụ bảo trì bảo dưỡng */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Các dịch vụ bảo trì bảo dưỡng của Delta
        </h2>
        <p className="text-gray-700 mb-6">
          Dựa vào thời gian sử dụng và tình trạng của quý khách hàng, Delta có hai dịch vụ bảo trì bảo dưỡng thang máy:
        </p>

        {/* Bảo trì bảo dưỡng thông thường */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Bảo trì bảo dưỡng thông thường:
          </h3>
          <div className="text-gray-700">
            <p className="mb-2">Điều kiện thực hiện:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Bảo dưỡng định kỳ hàng tháng hoặc 2 tháng 1 lần</li>
              <li>Sửa chữa thay hở buộc xuất</li>
              <li>Có hỗn trợ vật từ không phải thay thế, kỹ thuật viên của công ty sẽ kiểm tra và thông báo tình trạng thay hồng một số</li>
              <li>Tư vấn sử dụng và hướn duyệt của hệ</li>
              <li>Hỗ trợ khách hàng 24/7</li>
              <li>Bảo cáo tại có thể yêu cầu</li>
            </ul>
            <p className="mt-4 text-sm">
              Với dịch vụ này khách hàng sẽ có tỷ lệ và giá bảo trì thấp, tuy nhiên khách hàng có thể gặp trở ngại khi trang tự liện trụ và phải thay thế vật tư nhiều lần, tăm giam đoán hoạt động của thang máy và phát cho các hoạt động danh gỗ họp động, bảo giá, và bên hành kỳ hợp đồng vượng mức hiện chữa.
            </p>
          </div>
        </div>

        {/* Bảo trì bảo dưỡng toàn diện */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Bảo trì bảo dưỡng toàn diện:
          </h3>
          <p className="text-gray-700 mb-3">
            Chúng tôi chủ trách nhiệm trực: kiểm tra toàn diện bao gồm cho thang máy hoạt động bình thường. Chỗ đổng thay thế các thiết bị tốn phí thuận có sự có thức đến cho điểm phải thay mới thế trương hàng sở dụng thang máy không dùng suy chẩn tự hổng).
          </p>
          <div className="text-gray-700">
            <p className="mb-2">Điều kiện thực hiện:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Bảo dưỡng định kỳ hàng tháng</li>
              <li>Sửa chữa tư hởng đổi xuất</li>
              <li>Thay thế tậc bị các vật tư bự hồng</li>
              <li>Ngăn ngừa trước các trương hợp hoạng đổng thăng tủy cây</li>
              <li>Tron gói không gian phụ hiệu của phải thay thế vật tự có gái tữ cao hay thấp</li>
              <li>Tư vấn sử dụng và hướng duyệt của hệ</li>
              <li>Hỗ trợ khách hàng 24/7</li>
              <li>Bảo cáo tại có thể yêu cầu</li>
            </ul>
            <p className="mt-4 text-sm">
              Với gói dịch vụ này khách hàng có thể yên tâm sử dụng thang máy với mức chi phí cần được cố trỏ tong ngân sách, thang được hoạt động tân theo và chúng tối toàn trình sản như vật tư và cồng linh xung cư, kiếm một hoặc các cồng tình các ngươn ngẩm sách có đoạn.
            </p>
          </div>
        </div>
      </div>

      {/* Bảo trì bảo dưỡng thang máy theo quy trình chuyên nghiệp */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Bảo trì bảo dưỡng thang máy theo quy trình chuyên nghiệp
        </h2>
        <p className="text-gray-700 mb-4">
          Để đảm bảo việc vận hành tòa bảo tường rẻ, bảo hành cừa khách hàng. Kỹ thuật viên của Thang máy Delta sẽ thực hiện theo mỗi quy trình bán mã công ty áp dụng
        </p>
        
        <div className="space-y-3">
          <div><span className="font-semibold">1. Đánh giá sơ bộ:</span> Thông qua trạo đổi với đơn vị sử dụng cũi cần đuẩc tình hành chung mà thang máy đang gặp phải. Đánh giá sơ bộ, phát hiện những bất thường trong hoạt động của hệ.</div>
          
          <div><span className="font-semibold">2. Kiểm tra phòng máy:</span> Bật tay vào kiểm xoáo tra các chi tiết nhức, cẩu đào phong máy, máy kéo, quạt mát vận, mức bếp cử, khóp tối, thạy phiết của, phẩt vang, cấp tẩy, bộ phần chống xorácc,... Sau đó, kỹ thuật viên sử cất đánh kiểm tra bở còn hệ khẩn cấp, tình hư quy, cho thang chẩy kiểm tra tài hoạt động của từ điện, vệ tàm máy kén, tè đoán, phong máy, sửa chữa các bự hồng thạy thế từ điện chép bến nợi kỹ thuật vận nhật.</div>
          
          <div><span className="font-semibold">3. Kiểm tra Cabin:</span> Có hệ là sẽ kiểm tra bẵng thiều kiện cabin, đén, quạt và các chi tiết trong cabin để đảng giờ về tình trang hoạt động</div>
          
          <div><span className="font-semibold">4. Kiểm tra hỗ thống:</span> Cùng các hổi vận thiều, tv cấp tâu dẩu cabin, cứ trong, phanh an toàn, cữa tầng, ển truyền òhá cabin, thổng ngượa và kiểm tra các lổng sở gom han.</div>
          
          <div><span className="font-semibold">5. Kiểm tra đày kỗ (Pít):</span> Đánh giờ toàn diện các chi tiết nhức, cổng các đây tổ, kỗ trong, giảm chần tội trang và cabin, vệ sàm đây kỗ, sửa chữa các tạr hổng</div>
          
          <div><span className="font-semibold">6. Kiểm tra rút bằm tảng:</span> Bổ chỉnh các kể hiểm tờ sổ hở và kiểm cỗ chuyền theo tảng</div>
          
          <div><span className="font-semibold">7. Chạy thử thang máy để kiểm tra các thiết bị an toàn</span></div>
          
          <div><span className="font-semibold">8. Thông báo kết quả kiểm tra với khách hàng</span></div>
        </div>
      </div>

      {/* Lợi ích của khách hàng */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Lợi ích của khách hàng – Trách nhiệm của Công ty
        </h2>
        <p className="text-gray-700 mb-4">
          Công ty TNHH Thiết Bị và Thang Máy Delta có hệ thống hỗ trợ nâng đoán động trang máy chât lương cho tòa nhà của bạn, bao bảo bớy, sểu hội, nhà hàng, khách sạn, điểm thăm,... Đảm bảo thang máy luôn hoạt động an toàn từ 20/6 sẩn 25/24. Chính sách bảo dưỡng bảo trì đúng quy định cùng đội ngũ kỹ thuật viên có tay nghề sẽ giúp quý khách tiết kiệm và phải tăm som thâm có hông thang máy có thể hoạt động tối ưu.
        </p>
        <p className="text-gray-700">
          Với Delta, quý khách được hỗ trợ tận tình, tận tâm, mọi lúc, mọi nơi tong thời gian hoạt động tốt nhất. Kho vật tự, phù liệu công cũ toàn đảm bảo chất lượng và hiện đại. Ngoài việc cố sảo bảo bảo dưỡng tát mang tính qua hăng cử trang Delta luân đần sảng tợ với các vấn đề tăn quan đến trang máy để quý khách có những trải nghiệm tái động Thang Máy Delta không tham lậy tia tớ bắng chất lượng sản phẩm cũng dịch vự của chủ đoái
        </p>
      </div>

      {/* Customer service illustration placeholder */}
      <div className="flex justify-center mb-8">
        <div className="w-64 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500"> <img src={serviceImg} alt="[Hình minh họa dịch vụ khách hàng 24/7 - Customer service illustration]" />  </span>
        </div>
      </div>

      {/* Footer contact info */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        <p>Khách hàng cần tư vấn sũ chỉ về quy trình bảo trì, bảo dưỡng thang máy hoặc căẻo sở cỗ những máy trong quá trình sỏ đủng, vui lòng liên hệ với Thang máy Delta qua Hotline</p>
        <p className="font-semibold">bảo trì sửa chữa 24/7: 0989.68.85.85 đế được hỗ trợ nhanh nhất.</p>
      </div>
    </div>
  );
};

export default BaoTriThangMay;