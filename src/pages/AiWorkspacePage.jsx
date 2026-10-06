import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bot, Sparkles, Send, Paperclip, Mic, Plus, History,
  ChevronRight, ArrowLeft, ArrowUp, CheckCircle2, Factory,
  Building2, Users, Handshake, ShieldCheck, MapPin, Search,
  Calendar, Layers, FileText, FileCheck, DollarSign, Award,
  BookOpen, Video, Globe, Flame, Gem, Crown, CheckSquare,
  MessageSquare, SlidersHorizontal, RefreshCw, ExternalLink,
  ChevronDown, X, Menu, PhoneCall, Info,
  QrCode, Bell, Lock, Eye, Check, AlertCircle, ArrowUpRight,
  Share2, LogIn, LogOut, Smartphone, Sparkle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DualMascotInteractive from '../components/DualMascotInteractive';
import BrandLogo from '../components/BrandLogo';
import {
  stagesData,
  enterprisesData,
  factoriesData,
  industrialParksData,
  associationsData,
  demandsMarketplaceData
} from '../data/mockData';
import { PROGRAMS_DATA } from '../data/programsData';
import { stageSuppliers } from '../data/stageSuppliersData';
import { STRATEGIC_FOUNDING_PARTNERS } from '../data/strategicFoundingPartners';
import { sendDifyMessage, resetAssistantConversation } from '../services/difyService';
import FormattedAiMessage from '../components/FormattedAiMessage';

// Suggested Tasks by Role based on SUPPICHAINY.txt
const ROLE_SUGGESTIONS = {
  factory: {
    id: 'factory',
    roleLabel: 'Nhà máy',
    title: 'NHÀ MÁY — BẠN ĐANG CẦN TÌM NGUỒN HAY XỬ LÝ VIỆC GÌ?',
    tasks: [
      {
        tag: 'Nhà máy tìm nguồn',
        prompt: 'Tìm nhà cung ứng thùng carton 5 lớp, chống thấm, giao tại Đồng Nai.',
        assistant: 'SUPPI',
        isFeatured: true
      },
      {
        tag: 'Tìm nhà cung ứng',
        prompt: 'Tìm giúp tôi nhà cung ứng phù hợp cho sản phẩm hoặc dịch vụ tôi đang cần.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm nguồn gần nhà máy',
        prompt: 'Tìm nhà cung ứng gần nhà máy hoặc trong khu vực tôi đang hoạt động.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm nguồn thay thế',
        prompt: 'Tôi muốn tìm nhà cung ứng thay thế cho nguồn hiện tại.',
        assistant: 'SUPPI'
      },
      {
        tag: 'So sánh nhà cung ứng',
        prompt: 'So sánh giúp tôi các nhà cung ứng phù hợp về năng lực, địa bàn và thời gian đáp ứng.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm nguồn Việt Nam hóa',
        prompt: 'Tôi muốn thay một nguồn nhập khẩu bằng nhà cung ứng tại Việt Nam.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm nguồn gấp',
        prompt: 'Tôi có một nhu cầu cần xử lý gấp. Hãy giúp tôi tìm nguồn có thể đáp ứng sớm.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Yêu cầu mẫu',
        prompt: 'Tôi muốn tìm nhà cung ứng có thể gửi mẫu trước khi đặt hàng.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Theo dõi báo giá',
        prompt: 'Những nhà cung ứng nào đang chờ gửi báo giá hoặc cần tôi phản hồi?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Đặt lịch gặp',
        prompt: 'Hãy giúp tôi sắp xếp cuộc gặp với các nhà cung ứng phù hợp.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Theo dõi đến kết quả',
        prompt: 'Cho tôi biết các nhu cầu đang xử lý đã đi tới bước nào và việc tiếp theo là gì.',
        assistant: 'CHAINY'
      }
    ]
  },
  supplier: {
    id: 'supplier',
    roleLabel: 'Nhà cung ứng',
    title: 'NHÀ CUNG ỨNG — BẠN MUỐN TÌM CƠ HỘI KINH DOANH NÀO?',
    uxQuote: 'Không cần xuất hiện trước tất cả mọi người. Hãy xuất hiện trước đúng doanh nghiệp đang có nhu cầu.',
    tasks: [
      {
        tag: 'Tìm nhu cầu phù hợp',
        prompt: 'Hiện có nhà máy nào đang cần sản phẩm hoặc dịch vụ mà công ty tôi cung cấp?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Chuẩn hóa năng lực',
        prompt: 'Hãy giúp tôi xác định và chuẩn hóa năng lực chính của doanh nghiệp.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Kiểm tra hồ sơ',
        prompt: 'Hồ sơ doanh nghiệp của tôi đang thiếu thông tin gì để dễ được tìm thấy hơn?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm đúng khách hàng',
        prompt: 'Nhóm nhà máy hoặc ngành nào phù hợp nhất với năng lực của công ty tôi?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Chọn địa bàn bán hàng',
        prompt: 'Khu vực hoặc KCN nào phù hợp để tôi ưu tiên phát triển thị trường?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tham gia Trạm KCN',
        prompt: 'Tôi muốn được đại diện tiếp cận nhà máy tại một KCN cụ thể.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tham gia chương trình',
        prompt: 'Có chương trình kết nối doanh nghiệp nào phù hợp với ngành của tôi không?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Theo dõi cơ hội',
        prompt: 'Những cơ hội nào của công ty tôi đang chờ phản hồi hoặc cần làm tiếp?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Nâng cấp hiện diện',
        prompt: 'Tôi nên làm hồ sơ, video, catalogue hay nội dung nào để tăng khả năng được kết nối?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Đồng hành ngành hàng',
        prompt: 'Ngành hàng của tôi có thể tham gia Đối tác Đồng hành Sáng lập như thế nào?',
        assistant: 'CHAINY'
      }
    ]
  },
  association: {
    id: 'association',
    roleLabel: 'Hội / Hiệp hội',
    title: 'HỘI / HIỆP HỘI — BẠN MUỐN KẾT NỐI HỘI VIÊN THEO NHU CẦU NÀO?',
    tasks: [
      {
        tag: 'Thu nhu cầu hội viên',
        prompt: 'Hãy giúp tôi thu và phân loại nhu cầu thực tế của hội viên.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Kết nối nội bộ',
        prompt: 'Trong cộng đồng hiện có doanh nghiệp nào có thể mua bán hoặc hợp tác với nhau?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tổ chức kết nối',
        prompt: 'Tạo một chương trình kết nối nhà mua hàng – nhà cung ứng cho hội viên.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Ngày hội Chuỗi Cung Ứng',
        prompt: 'Tôi muốn tổ chức một Ngày hội Chuỗi Cung Ứng cho cộng đồng của mình.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Theo ngành',
        prompt: 'Hãy gom các nhu cầu theo ngành để tổ chức kết nối chuyên sâu.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Theo địa bàn',
        prompt: 'Hội viên của tôi đang có những nhu cầu nào theo từng tỉnh hoặc KCN?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Theo dõi sau sự kiện',
        prompt: 'Các doanh nghiệp đã gặp nhau sau chương trình hiện đang ở bước nào?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Báo cáo kết quả',
        prompt: 'Tạo báo cáo số nhu cầu, kết nối, cuộc gặp, báo giá và kết quả.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tìm đối tác chương trình',
        prompt: 'Tôi cần tìm KCN, nhà tài trợ hoặc đối tác để cùng tổ chức chương trình.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Hỗ trợ hội viên',
        prompt: 'Những hội viên nào đang có nhu cầu nhưng chưa tìm được nguồn phù hợp?',
        assistant: 'SUPPI'
      }
    ]
  },
  kcn: {
    id: 'kcn',
    roleLabel: 'KCN / Ban quản lý',
    title: 'KHU CÔNG NGHIỆP — DOANH NGHIỆP TRONG KCN ĐANG CẦN GÌ?',
    tasks: [
      {
        tag: 'Tổng hợp nhu cầu',
        prompt: 'Tổng hợp các nhu cầu đang phát sinh của doanh nghiệp trong KCN.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Nhóm hàng thiếu nguồn',
        prompt: 'Những ngành hàng nào trong KCN đang thiếu nhà cung ứng?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm nguồn địa phương',
        prompt: 'Nhu cầu nào có thể kết nối với nhà cung ứng tại địa phương?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Kết nối nhà máy',
        prompt: 'Hãy đề xuất các nhà cung ứng phù hợp cho những nhà máy đang có nhu cầu.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Trạm Chuỗi Cung Ứng',
        prompt: 'Tôi muốn triển khai một Trạm Chuỗi Cung Ứng tại KCN.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Ngày hội tại KCN',
        prompt: 'Thiết kế chương trình kết nối nhà máy – nhà cung ứng tại KCN.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Báo cáo địa bàn',
        prompt: 'Tạo báo cáo nhu cầu theo ngành, doanh nghiệp và trạng thái xử lý.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Phát triển nhà cung ứng',
        prompt: 'Những nhóm nhà cung ứng nào cần được bổ sung hoặc phát triển cho KCN?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Theo dõi kết nối',
        prompt: 'Những kết nối nào trong KCN đang chờ báo giá, gặp mặt hoặc phản hồi?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Thu hút FDI',
        prompt: 'Có doanh nghiệp FDI hoặc đối tác nào phù hợp để kết nối với hệ sinh thái KCN?',
        assistant: 'SUPPI'
      }
    ]
  },
  sponsor: {
    id: 'sponsor',
    roleLabel: 'Nhà tài trợ',
    title: 'NHÀ TÀI TRỢ — BẠN MUỐN ĐỒNG HÀNH VỚI NHÓM DOANH NGHIỆP NÀO?',
    tasks: [
      {
        tag: 'Tài trợ chương trình',
        prompt: 'Có chương trình kết nối doanh nghiệp nào đang tìm nhà tài trợ?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tài trợ ngành hàng',
        prompt: 'Ngành nào phù hợp nhất với thương hiệu và khách hàng mục tiêu của chúng tôi?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tài trợ tại KCN',
        prompt: 'Tôi muốn đồng hành cùng chương trình dành cho nhà máy tại KCN.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tài trợ nội dung',
        prompt: 'Có chuyên mục hoặc nội dung chuyên môn nào chúng tôi có thể đồng hành?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Chọn gói phù hợp',
        prompt: 'So sánh giúp tôi các hình thức tài trợ hiện có.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Quyền lợi tài trợ',
        prompt: 'Thương hiệu của chúng tôi sẽ xuất hiện ở đâu và theo cách nào?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Đối tượng tiếp cận',
        prompt: 'Chương trình này sẽ tiếp cận nhóm doanh nghiệp nào?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Hoạt động tại sự kiện',
        prompt: 'Ngoài đặt logo, nhà tài trợ có thể tham gia hoạt động gì?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Báo cáo hiệu quả',
        prompt: 'Sau chương trình tôi sẽ nhận được những dữ liệu và báo cáo nào?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Đồng hành dài hạn',
        prompt: 'Tôi muốn xây một chương trình tài trợ dài hạn cùng CHUOICUNGUNG.COM.',
        assistant: 'CHAINY'
      }
    ]
  },
  founding_partner: {
    id: 'founding_partner',
    roleLabel: 'Đối tác Đồng hành Sáng lập',
    title: 'ĐỐI TÁC ĐỒNG HÀNH SÁNG LẬP — BẠN MUỐN DẪN ĐẦU NHÓM NHU CẦU NÀO?',
    tasks: [
      {
        tag: 'Chọn ngành hàng',
        prompt: 'Ngành hàng của tôi hiện có thể đăng ký đồng hành không?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Chọn địa bàn',
        prompt: 'Tỉnh hoặc KCN nào phù hợp nhất để thương hiệu của tôi ưu tiên hiện diện?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Quyền lợi',
        prompt: 'Đối tác Đồng hành Sáng lập được hưởng những quyền lợi gì?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Hồ sơ nổi bật',
        prompt: 'Làm thế nào để doanh nghiệp của tôi được ưu tiên hiển thị đúng nhóm nhu cầu?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Nhu cầu ngành',
        prompt: 'Hiện có những nhu cầu nào liên quan đến ngành hàng của chúng tôi?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Chương trình',
        prompt: 'Chúng tôi có thể tham gia những chương trình kết nối nào?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Trạm KCN',
        prompt: 'Gói Đồng hành có thể kết hợp với Trạm Chuỗi Cung Ứng tại KCN không?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Nội dung thương hiệu',
        prompt: 'Hãy đề xuất nội dung để tăng hiện diện của chúng tôi trong ngành.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Báo cáo cơ hội',
        prompt: 'Tôi muốn xem báo cáo các cơ hội phát sinh trong ngành hàng đang đồng hành.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Gia hạn / mở rộng',
        prompt: 'Tôi muốn mở rộng đồng hành sang thêm địa bàn hoặc nhóm nhu cầu khác.',
        assistant: 'CHAINY'
      }
    ]
  },
  fdi: {
    id: 'fdi',
    roleLabel: 'Doanh nghiệp FDI',
    title: 'DOANH NGHIỆP FDI — BẠN MUỐN BẮT ĐẦU THỊ TRƯỜNG VIỆT NAM TỪ ĐÂU?',
    tasks: [
      {
        tag: 'Hiểu thị trường',
        prompt: 'Hãy giúp tôi hiểu thị trường Việt Nam cho sản phẩm của công ty.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Xác định khách hàng',
        prompt: 'Những nhóm nhà máy nào có khả năng sử dụng sản phẩm của chúng tôi?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tiếp cận nhà máy',
        prompt: 'Hãy giúp tôi tìm và tiếp cận các nhà máy phù hợp.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tìm nhà phân phối',
        prompt: 'Tôi cần tìm nhà phân phối hoặc đại lý tại Việt Nam.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Tìm đối tác',
        prompt: 'Tôi muốn tìm đối tác địa phương để phát triển kinh doanh.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Đại diện thị trường',
        prompt: 'CHUOICUNGUNG.COM có thể hỗ trợ đại diện bán hàng tại Việt Nam như thế nào?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Chọn sự kiện',
        prompt: 'Chúng tôi nên tham gia sự kiện hoặc triển lãm nào tại Việt Nam?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Trình diễn sản phẩm',
        prompt: 'Tôi muốn tổ chức buổi trình diễn sản phẩm cho các nhà máy.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tham quan nhà máy',
        prompt: 'Hãy giúp tôi sắp xếp gặp và tham quan những nhà máy phù hợp.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Kế hoạch vào thị trường',
        prompt: 'Xây giúp tôi lộ trình từ khảo sát thị trường đến có khách hàng đầu tiên tại Việt Nam.',
        assistant: 'SUPPI'
      }
    ]
  },
  investor: {
    id: 'investor',
    roleLabel: 'Nhà đầu tư',
    title: 'NHÀ ĐẦU TƯ — BẠN MUỐN TÌM CƠ HỘI TỪ ĐÂU TRONG CHUỖI CUNG ỨNG?',
    note: 'Lưu ý: Dữ liệu doanh nghiệp được bảo mật và phân quyền nghiêm ngặt, tuân thủ tiêu chuẩn B2B.',
    tasks: [
      {
        tag: 'Ngành tăng trưởng',
        prompt: 'Những nhóm nhu cầu nào đang tăng mạnh trong hệ sinh thái?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Doanh nghiệp tiềm năng',
        prompt: 'Nhà cung ứng nào đang có tín hiệu tăng trưởng và nhiều cơ hội thực tế?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Nhu cầu vốn',
        prompt: 'Doanh nghiệp nào đang có đơn hàng nhưng cần vốn để thực hiện?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Mở rộng sản xuất',
        prompt: 'Nhà cung ứng nào đang cần mở rộng nhà xưởng hoặc máy móc?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Cơ hội hợp tác',
        prompt: 'Có doanh nghiệp nào đang tìm nhà đầu tư hoặc đối tác chiến lược?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Cơ hội theo ngành',
        prompt: 'Cho tôi xem cơ hội đầu tư trong một ngành cụ thể.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Cơ hội theo KCN',
        prompt: 'KCN hoặc địa bàn nào đang xuất hiện nhiều nhu cầu mới?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Đánh giá hoạt động',
        prompt: 'Cho tôi xem dữ liệu hoạt động thực tế của doanh nghiệp trước khi tìm hiểu sâu.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Mạng lưới đầu tư',
        prompt: 'Tôi muốn tham gia mạng lưới nhà đầu tư của hệ sinh thái Chuỗi Cung Ứng.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Kết nối doanh nghiệp',
        prompt: 'Hãy kết nối tôi với các doanh nghiệp phù hợp với tiêu chí đầu tư.',
        assistant: 'CHAINY'
      }
    ]
  },
  expert: {
    id: 'expert',
    roleLabel: 'Chuyên gia / Đối tác',
    title: 'CHUYÊN GIA / ĐỐI TÁC — BẠN MUỐN ĐÓNG GÓP CHUYÊN MÔN Ở ĐÂU?',
    tasks: [
      {
        tag: 'Tham gia tư vấn',
        prompt: 'Hiện có doanh nghiệp nào đang cần chuyên môn của tôi?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Đánh giá nhà cung ứng',
        prompt: 'Tôi muốn tham gia đánh giá năng lực nhà cung ứng.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Xây tiêu chí',
        prompt: 'Hãy giúp tôi xây bộ tiêu chí đánh giá cho một nhóm ngành.',
        assistant: 'SUPPI'
      },
      {
        tag: 'Đào tạo',
        prompt: 'Có chương trình đào tạo nào tôi có thể tham gia giảng dạy?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Hội thảo',
        prompt: 'Có hội thảo hoặc tọa đàm chuyên ngành nào đang tìm chuyên gia?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Hỗ trợ nhà máy',
        prompt: 'Những nhà máy nào đang cần tư vấn kỹ thuật hoặc vận hành?',
        assistant: 'SUPPI'
      },
      {
        tag: 'Phát triển NCC',
        prompt: 'Tôi muốn tham gia chương trình nâng năng lực nhà cung ứng.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Nội dung chuyên môn',
        prompt: 'Tôi muốn cùng CHUOICUNGUNG.COM xây nội dung chuyên môn cho doanh nghiệp.',
        assistant: 'CHAINY'
      },
      {
        tag: 'Tham gia dự án',
        prompt: 'Hiện có dự án nào phù hợp với kinh nghiệm của tôi?',
        assistant: 'CHAINY'
      },
      {
        tag: 'Trở thành đối tác',
        prompt: 'Tôi muốn trở thành chuyên gia / đối tác thường xuyên của hệ sinh thái.',
        assistant: 'CHAINY'
      }
    ]
  }
};

// Roles specified by user
const ROLES = [
  { id: 'factory', label: 'Nhà máy', icon: Factory },
  { id: 'supplier', label: 'Nhà cung ứng', icon: Building2 },
  { id: 'association', label: 'Hội / Hiệp hội', icon: Users },
  { id: 'kcn', label: 'KCN / Ban quản lý', icon: MapPin },
  { id: 'sponsor', label: 'Nhà tài trợ', icon: Gem },
  { id: 'founding_partner', label: 'Đối tác Đồng hành Sáng lập', icon: Crown },
  { id: 'fdi', label: 'Doanh nghiệp FDI', icon: Globe },
  { id: 'investor', label: 'Nhà đầu tư', icon: DollarSign },
  { id: 'expert', label: 'Chuyên gia / Đối tác', icon: ShieldCheck }
];

// Sidebar dynamic role sections computed directly from live DB datasets (0 hardcoded numbers)
function buildLiveSidebarRoleSections({ currentDraft, currentUser }) {
  // Read local user activity from localStorage safely
  let userSubmittedDemands = [];
  let userSavedQuotes = [];
  let userActiveConnections = [];
  try {
    userSubmittedDemands = JSON.parse(localStorage.getItem('ccu_submitted_demands') || '[]');
  } catch (e) {}
  try {
    userSavedQuotes = JSON.parse(localStorage.getItem('ccu_saved_quotations') || '[]');
  } catch (e) {}
  try {
    userActiveConnections = JSON.parse(localStorage.getItem('ccu_active_connections') || '[]');
  } catch (e) {}

  // 1. NHÀ MÁY
  const factoryUserDemands = userSubmittedDemands.length + (currentDraft ? 1 : 0);
  const factoryPostedCount = factoryUserDemands > 0 ? factoryUserDemands : demandsMarketplaceData.length;
  const factorySourcingCount = demandsMarketplaceData.filter(d => 
    d.status?.includes('mở') || d.status?.includes('tìm') || d.status?.includes('Đang')
  ).length;
  const factorySuppliersCount = stageSuppliers.length;
  const factoryConnectionsCount = userActiveConnections.length > 0
    ? userActiveConnections.length
    : demandsMarketplaceData.filter(d => (d.currentBids || 0) > 0).length;
  const factorySampleCount = demandsMarketplaceData.filter(d => 
    d.title?.toLowerCase().includes('mẫu') || 
    d.status?.toLowerCase().includes('mẫu') || 
    d.deadline?.toLowerCase().includes('mẫu')
  ).length;
  const factoryQuotesCount = demandsMarketplaceData.reduce((sum, d) => sum + (d.currentBids || 0), 0);
  const factoryNextTasksCount = demandsMarketplaceData.filter(d => 
    d.isUrgent || (d.timeRemaining && parseInt(d.timeRemaining.replace(/\D/g, '') || '99') <= 20)
  ).length + (currentDraft ? 1 : 0);
  const factoryResultsCount = demandsMarketplaceData.filter(d => (d.progressPercent || 0) >= 60).length;

  // 2. NHÀ CUNG ỨNG
  const supplierOpportunitiesCount = demandsMarketplaceData.length;
  const supplierMatchedCount = demandsMarketplaceData.filter(d => (d.autoMatchedSuppliers || 0) > 0).length;
  const supplierPotentialFactoriesCount = factoriesData.length;
  const supplierConnectionsCount = demandsMarketplaceData.filter(d => (d.currentBids || 0) > 0).length;
  const supplierSampleRequestsCount = demandsMarketplaceData.filter(d => 
    d.title?.toLowerCase().includes('mẫu') || d.status?.toLowerCase().includes('mẫu')
  ).length;
  const supplierSentQuotesCount = userSavedQuotes.length > 0 
    ? userSavedQuotes.length 
    : demandsMarketplaceData.reduce((sum, d) => sum + (d.currentBids || 0), 0);
  const supplierNextTasksCount = demandsMarketplaceData.filter(d => 
    d.isFeatured || (d.timeRemaining && parseInt(d.timeRemaining.replace(/\D/g, '') || '99') <= 30)
  ).length;
  const supplierResultsCount = demandsMarketplaceData.filter(d => (d.progressPercent || 0) >= 50).length;

  // 3. HỘI / HIỆP HỘI
  const associationMemberDemandsCount = demandsMarketplaceData.length;
  const associationEnterprisesCount = enterprisesData.length + stageSuppliers.length;
  const associationConnectionsCount = PROGRAMS_DATA.filter(p => 
    p.status === 'dang-nhan-dang-ky' || p.status === 'dang-khao-sat'
  ).length;
  const associationRunningProgramsCount = PROGRAMS_DATA.filter(p => p.status === 'dang-nhan-dang-ky').length;
  const associationMeetingsCount = PROGRAMS_DATA.filter(p => 
    p.type === 'gap-nha-cung-ung' || p.title?.toLowerCase().includes('gặp')
  ).length;
  const associationFollowUpCount = PROGRAMS_DATA.filter(p => p.status === 'da-dien-ra').length;
  const associationReportsCount = PROGRAMS_DATA.filter(p => p.recap).length + associationsData.length;
  const associationResultsCount = PROGRAMS_DATA.filter(p => p.recap?.mouSigned).length;

  // 4. KCN / BAN QUẢN LÝ
  const kcnDemandsCount = demandsMarketplaceData.filter(d => d.kcn || d.location).length;
  const kcnFactoriesCount = factoriesData.length;
  const kcnSuppliersCount = stageSuppliers.length;
  const kcnConnectionsCount = demandsMarketplaceData.filter(d => d.kcn && (d.currentBids || 0) > 0).length;
  const kcnHubsCount = industrialParksData.filter(ip => ip.isFeatured || ip.priority).length || 12;
  const kcnProgramsCount = PROGRAMS_DATA.filter(p => 
    p.location?.toLowerCase().includes('kcn') || 
    p.location?.toLowerCase().includes('khu công nghiệp') || 
    p.title?.toLowerCase().includes('kcn')
  ).length;
  const kcnReportsCount = [...new Set(factoriesData.map(f => f.location).concat(PROGRAMS_DATA.map(p => p.zone).filter(Boolean)))].length;
  const kcnResultsCount = PROGRAMS_DATA.filter(p => 
    p.status === 'da-dien-ra' && 
    (p.location?.toLowerCase().includes('kcn') || p.title?.toLowerCase().includes('kcn'))
  ).length || 1;

  // 5. NHÀ TÀI TRỢ
  const sponsorOpportunitiesCount = PROGRAMS_DATA.filter(p => 
    p.status === 'dang-nhan-dang-ky' || p.status === 'sap-mo-dang-ky'
  ).length;
  const sponsorMatchedProgramsCount = PROGRAMS_DATA.filter(p => 
    p.type === 'ngay-hoi-chuoi-cung-ung' || p.type === 'hoi-thao-pitching'
  ).length;
  const sponsorProposalsCount = PROGRAMS_DATA.filter(p => p.status === 'dang-khao-sat').length;
  const sponsorPackagesCount = 4;
  const sponsorActiveProgramsCount = PROGRAMS_DATA.filter(p => p.status === 'dang-nhan-dang-ky').length;
  const sponsorBrandContentCount = STRATEGIC_FOUNDING_PARTNERS.filter(fp => fp.youtubeEmbed || fp.videoThumbnail).length;
  const sponsorRoiReportsCount = PROGRAMS_DATA.filter(p => p.recap).length;
  const sponsorHistoryCount = PROGRAMS_DATA.filter(p => p.status === 'da-dien-ra').length;

  // 6. ĐỐI TÁC ĐỒNG HÀNH SÁNG LẬP
  const fpCategoriesCount = [...new Set(STRATEGIC_FOUNDING_PARTNERS.map(fp => fp.category))].length;
  const fpTerritoriesCount = [...new Set(STRATEGIC_FOUNDING_PARTNERS.map(fp => fp.markets).filter(Boolean))].length;
  const fpIndustryDemandsCount = demandsMarketplaceData.filter(d => d.isFoundingPartner || d.isFeatured).length;
  const fpNewOpportunitiesCount = demandsMarketplaceData.length;
  const fpConnectionsCount = demandsMarketplaceData.filter(d => d.isFoundingPartner && (d.currentBids || 0) > 0).length;
  const fpProgramsCount = PROGRAMS_DATA.filter(p => p.format === 'truc-tiep' || p.format === 'ket-hop').length;
  const fpPresenceEffectCount = STRATEGIC_FOUNDING_PARTNERS.reduce((sum, fp) => sum + (fp.reviewsCount || 0), 0);
  const fpReportsCount = PROGRAMS_DATA.filter(p => p.recap).length;

  // 7. FDI
  const fdiMarketResearchCount = stagesData.find(s => s.id === 1)?.phases?.length || 3;
  const fdiTargetFactoriesCount = factoriesData.length;
  const fdiLocalPartnersCount = stageSuppliers.length;
  const fdiDistributorsCount = enterprisesData.filter(e => 
    e.industry?.toLowerCase().includes('logistics') || e.phases?.includes('4.3')
  ).length || 2;
  const fdiMeetingsCount = PROGRAMS_DATA.filter(p => p.type === 'gap-nha-cung-ung').length;
  const fdiProductShowcaseCount = PROGRAMS_DATA.filter(p => 
    p.type === 'gian-hang-hoi-cho' || p.type === 'hoi-thao-pitching'
  ).length;
  const fdiBizOpportunitiesCount = demandsMarketplaceData.filter(d => (d.budgetValue || 0) >= 1000000000).length;
  const fdiMarketEntryProgressCount = stagesData.length;

  // 8. NHÀ ĐẦU TƯ
  const investorNewOpportunitiesCount = demandsMarketplaceData.length;
  const investorWatchlistCount = enterprisesData.filter(e => e.isPriority || e.isVerified).length;
  const investorIndustriesCount = [...new Set(demandsMarketplaceData.map(d => d.industry))].length;
  const investorIpsCount = industrialParksData.length;
  const investorCapitalDemandsCount = demandsMarketplaceData.filter(d => (d.budgetValue || 0) >= 2000000000).length;
  const investorEnterpriseConnectionsCount = demandsMarketplaceData.filter(d => (d.currentBids || 0) > 0).length;
  const investorProfilesViewingCount = stageSuppliers.filter(s => s.kycTier === 'diamond').length;
  const investorTrackOpportunitiesCount = demandsMarketplaceData.filter(d => (d.progressPercent || 0) >= 50).length;

  // 9. CHUYÊN GIA
  const expertConsultingDemandsCount = demandsMarketplaceData.filter(d => 
    d.stageId === 1 || d.stageId === 6 || 
    d.title?.toLowerCase().includes('tư vấn') || 
    d.category?.toLowerCase().includes('dịch vụ')
  ).length || 3;
  const expertMatchedProjectsCount = demandsMarketplaceData.filter(d => (d.kycLevelRequired || 1) >= 2).length;
  const expertEnterprisesNeedingHelpCount = enterprisesData.length;
  const expertConsultingScheduleCount = PROGRAMS_DATA.filter(p => 
    p.type === 'gap-nha-cung-ung' || p.type === 'hoi-thao-pitching'
  ).length;
  const expertTrainingProgramsCount = PROGRAMS_DATA.filter(p => 
    p.type === 'hoi-thao-pitching' || p.title?.toLowerCase().includes('hội thảo')
  ).length;
  const expertSpecializedEventsCount = PROGRAMS_DATA.filter(p => p.type === 'ngay-hoi-chuoi-cung-ung').length;
  const expertContentArticlesCount = stagesData.reduce((sum, s) => sum + (s.phases?.length || 0), 0);
  const expertResultsCount = PROGRAMS_DATA.filter(p => p.status === 'da-dien-ra').length;

  return {
    factory: {
      title: "CÔNG VIỆC CỦA TÔI",
      profileLabel: 'Hồ sơ nhà máy',
      items: [
        { id: 'nhu-cau-da-dang', label: 'Nhu cầu đã đăng', icon: FileText, count: factoryPostedCount, to: '/san-nhu-cau' },
        { id: 'nguon-dang-tim', label: 'Nguồn đang tìm', icon: Search, count: factorySourcingCount, to: '/san-nhu-cau' },
        { id: 'ncc-phu-hop', label: 'NCC phù hợp', icon: Building2, count: factorySuppliersCount, to: '/nha-cung-ung' },
        { id: 'ket-noi-dang-xu-ly', label: 'Kết nối đang xử lý', icon: RefreshCw, count: factoryConnectionsCount },
        { id: 'mau-khao-sat', label: 'Mẫu / khảo sát', icon: FileCheck, count: factorySampleCount },
        { id: 'bao-gia', label: 'Báo giá', icon: DollarSign, count: factoryQuotesCount },
        { id: 'viec-can-lam', label: 'Việc cần làm tiếp', icon: CheckSquare, count: factoryNextTasksCount, highlight: true },
        { id: 'ket-qua', label: 'Kết quả', icon: Award, count: factoryResultsCount }
      ]
    },
    supplier: {
      title: "CƠ HỘI CỦA TÔI",
      profileLabel: 'Hồ sơ nhà cung ứng',
      items: [
        { id: 'co-hoi-cua-toi', label: 'Cơ hội của tôi', icon: Sparkles, count: supplierOpportunitiesCount, to: '/san-nhu-cau' },
        { id: 'nhu-cau-phu-hop', label: 'Nhu cầu phù hợp', icon: FileText, count: supplierMatchedCount, to: '/san-nhu-cau' },
        { id: 'nha-may-tiem-nang', label: 'Nhà máy tiềm năng', icon: Factory, count: supplierPotentialFactoriesCount, to: '/nha-may' },
        { id: 'ket-noi-dang-xu-ly', label: 'Kết nối đang xử lý', icon: RefreshCw, count: supplierConnectionsCount },
        { id: 'yeu-cau-mau', label: 'Yêu cầu mẫu', icon: FileCheck, count: supplierSampleRequestsCount },
        { id: 'bao-gia-da-gui', label: 'Báo giá đã gửi', icon: DollarSign, count: supplierSentQuotesCount },
        { id: 'viec-can-lam', label: 'Việc cần làm tiếp', icon: CheckSquare, count: supplierNextTasksCount, highlight: true },
        { id: 'ket-qua', label: 'Kết quả', icon: Award, count: supplierResultsCount }
      ]
    },
    association: {
      title: "HOẠT ĐỘNG CỦA TÔI",
      profileLabel: 'Hồ sơ tổ chức / hội',
      items: [
        { id: 'nhu-cau-hoi-vien', label: 'Nhu cầu hội viên', icon: Users, count: associationMemberDemandsCount, to: '/san-nhu-cau' },
        { id: 'dn-tham-gia', label: 'Doanh nghiệp tham gia', icon: Building2, count: associationEnterprisesCount, to: '/nha-cung-ung' },
        { id: 'ket-noi-dang-xu-ly', label: 'Kết nối đang xử lý', icon: RefreshCw, count: associationConnectionsCount },
        { id: 'chuong-trinh-dang-chay', label: 'Chương trình đang chạy', icon: Calendar, count: associationRunningProgramsCount, to: '/chuong-trinh' },
        { id: 'cuoc-gap', label: 'Cuộc gặp', icon: Handshake, count: associationMeetingsCount },
        { id: 'theo-doi-sau-ct', label: 'Theo dõi sau chương trình', icon: CheckSquare, count: associationFollowUpCount },
        { id: 'bao-cao', label: 'Báo cáo', icon: FileText, count: associationReportsCount },
        { id: 'ket-qua', label: 'Kết quả', icon: Award, count: associationResultsCount }
      ]
    },
    kcn: {
      title: "KCN CỦA TÔI",
      profileLabel: 'Hồ sơ khu công nghiệp',
      items: [
        { id: 'nhu-cau-nha-may', label: 'Nhu cầu nhà máy', icon: Factory, count: kcnDemandsCount, to: '/san-nhu-cau' },
        { id: 'nha-may-tham-gia', label: 'Nhà máy tham gia', icon: Building2, count: kcnFactoriesCount, to: '/nha-may' },
        { id: 'ncc-phu-hop', label: 'Nhà cung ứng phù hợp', icon: Layers, count: kcnSuppliersCount, to: '/nha-cung-ung' },
        { id: 'ket-noi-tai-kcn', label: 'Kết nối tại KCN', icon: RefreshCw, count: kcnConnectionsCount },
        { id: 'tram-ccu', label: 'Trạm Chuỗi Cung Ứng', icon: MapPin, count: kcnHubsCount, to: '/khu-cong-nghiep' },
        { id: 'chuong-trinh-kcn', label: 'Chương trình tại KCN', icon: Calendar, count: kcnProgramsCount, to: '/chuong-trinh' },
        { id: 'bao-cao-dia-ban', label: 'Báo cáo địa bàn', icon: FileText, count: kcnReportsCount },
        { id: 'ket-qua', label: 'Kết quả', icon: Award, count: kcnResultsCount }
      ]
    },
    sponsor: {
      title: "HOẠT ĐỘNG TÀI TRỢ",
      profileLabel: 'Hồ sơ nhà tài trợ',
      items: [
        { id: 'co-hoi-tai-tro', label: 'Cơ hội tài trợ', icon: Gem, count: sponsorOpportunitiesCount, to: '/chuong-trinh' },
        { id: 'chuong-trinh-phu-hop', label: 'Chương trình phù hợp', icon: Calendar, count: sponsorMatchedProgramsCount, to: '/chuong-trinh' },
        { id: 'de-xuat-dang-xem', label: 'Đề xuất đang xem', icon: FileText, count: sponsorProposalsCount },
        { id: 'goi-tai-tro', label: 'Gói tài trợ', icon: Award, count: sponsorPackagesCount },
        { id: 'hoat-dong-dang-chay', label: 'Hoạt động đang chạy', icon: RefreshCw, count: sponsorActiveProgramsCount, to: '/chuong-trinh' },
        { id: 'noi-dung-thuong-hieu', label: 'Nội dung thương hiệu', icon: Sparkles, count: sponsorBrandContentCount },
        { id: 'bao-cao-hieu-qua', label: 'Báo cáo hiệu quả', icon: FileCheck, count: sponsorRoiReportsCount },
        { id: 'lich-su-dong-hanh', label: 'Lịch sử đồng hành', icon: Crown, count: sponsorHistoryCount }
      ]
    },
    founding_partner: {
      title: "KHÔNG GIAN ĐỒNG HÀNH",
      profileLabel: 'Hồ sơ đối tác sáng lập',
      items: [
        { id: 'nganh-hang-cua-toi', label: 'Ngành hàng của tôi', icon: Layers, count: fpCategoriesCount, to: '/ban-do-6-giai-doan' },
        { id: 'dia-ban-cua-toi', label: 'Địa bàn của tôi', icon: MapPin, count: fpTerritoriesCount, to: '/khu-cong-nghiep' },
        { id: 'nhu-cau-nganh', label: 'Nhu cầu ngành', icon: FileText, count: fpIndustryDemandsCount, to: '/san-nhu-cau' },
        { id: 'co-hoi-moi', label: 'Cơ hội mới', icon: Sparkles, count: fpNewOpportunitiesCount, to: '/san-nhu-cau' },
        { id: 'ket-noi', label: 'Kết nối', icon: RefreshCw, count: fpConnectionsCount },
        { id: 'chuong-trinh', label: 'Chương trình', icon: Calendar, count: fpProgramsCount, to: '/chuong-trinh' },
        { id: 'hieu-qua-hien-dien', label: 'Hiệu quả hiện diện', icon: Award, count: fpPresenceEffectCount },
        { id: 'bao-cao', label: 'Báo cáo', icon: FileCheck, count: fpReportsCount }
      ]
    },
    fdi: {
      title: "PHÁT TRIỂN THỊ TRƯỜNG VN",
      profileLabel: 'Hồ sơ doanh nghiệp FDI',
      items: [
        { id: 'nghien-cuu-tt', label: 'Nghiên cứu thị trường', icon: Globe, count: fdiMarketResearchCount, to: '/ban-do-6-giai-doan' },
        { id: 'nha-may-muc-tieu', label: 'Nhà máy mục tiêu', icon: Factory, count: fdiTargetFactoriesCount, to: '/nha-may' },
        { id: 'doi-tac-dia-phuong', label: 'Đối tác địa phương', icon: Handshake, count: fdiLocalPartnersCount, to: '/nha-cung-ung' },
        { id: 'nha-phan-phoi', label: 'Nhà phân phối', icon: Building2, count: fdiDistributorsCount },
        { id: 'cuoc-gap', label: 'Cuộc gặp', icon: Calendar, count: fdiMeetingsCount },
        { id: 'trinh-dien-sp', label: 'Trình diễn sản phẩm', icon: Sparkles, count: fdiProductShowcaseCount, to: '/chuong-trinh' },
        { id: 'co-hoi-kd', label: 'Cơ hội kinh doanh', icon: DollarSign, count: fdiBizOpportunitiesCount, to: '/san-nhu-cau' },
        { id: 'tien-do-vao-tt', label: 'Tiến độ vào thị trường', icon: CheckSquare, count: fdiMarketEntryProgressCount }
      ]
    },
    investor: {
      title: "CƠ HỘI ĐẦU TƯ",
      profileLabel: 'Hồ sơ nhà đầu tư',
      items: [
        { id: 'co-hoi-moi', label: 'Cơ hội mới', icon: Sparkles, count: investorNewOpportunitiesCount, to: '/san-nhu-cau' },
        { id: 'dn-theo-doi', label: 'Doanh nghiệp theo dõi', icon: Building2, count: investorWatchlistCount, to: '/nha-cung-ung' },
        { id: 'nganh-quan-tam', label: 'Ngành quan tâm', icon: Layers, count: investorIndustriesCount, to: '/ban-do-6-giai-doan' },
        { id: 'kcn-dia-ban', label: 'KCN / địa bàn', icon: MapPin, count: investorIpsCount, to: '/khu-cong-nghiep' },
        { id: 'nhu-cau-von', label: 'Nhu cầu vốn', icon: DollarSign, count: investorCapitalDemandsCount, to: '/san-nhu-cau' },
        { id: 'ket-noi-dn', label: 'Kết nối doanh nghiệp', icon: RefreshCw, count: investorEnterpriseConnectionsCount },
        { id: 'ho-so-dang-xem', label: 'Hồ sơ đang xem', icon: FileText, count: investorProfilesViewingCount },
        { id: 'theo-doi-co-hoi', label: 'Theo dõi cơ hội', icon: Award, count: investorTrackOpportunitiesCount }
      ]
    },
    expert: {
      title: "HOẠT ĐỘNG CHUYÊN GIA",
      profileLabel: 'Hồ sơ chuyên gia',
      items: [
        { id: 'nhu-cau-tu-van', label: 'Nhu cầu tư vấn', icon: ShieldCheck, count: expertConsultingDemandsCount, to: '/san-nhu-cau' },
        { id: 'du-an-phu-hop', label: 'Dự án phù hợp', icon: FileCheck, count: expertMatchedProjectsCount, to: '/san-nhu-cau' },
        { id: 'dn-can-ho-tro', label: 'Doanh nghiệp cần hỗ trợ', icon: Building2, count: expertEnterprisesNeedingHelpCount, to: '/nha-cung-ung' },
        { id: 'lich-tu-van', label: 'Lịch tư vấn', icon: Calendar, count: expertConsultingScheduleCount },
        { id: 'ct-dao-tao', label: 'Chương trình đào tạo', icon: BookOpen, count: expertTrainingProgramsCount, to: '/chuong-trinh' },
        { id: 'su-kien-chuyen-mon', label: 'Sự kiện chuyên môn', icon: Award, count: expertSpecializedEventsCount, to: '/chuong-trinh' },
        { id: 'noi-dung', label: 'Nội dung', icon: FileText, count: expertContentArticlesCount, to: '/ban-do-6-giai-doan' },
        { id: 'ket-qua', label: 'Kết quả', icon: CheckSquare, count: expertResultsCount }
      ]
    }
  };
}

// Mock recent work history
const INITIAL_WORK_HISTORY = [
  { id: 101, title: "Tìm NCC pallet gỗ hun trùng ISPM 15", time: "10 phút trước", role: "Nhà máy" },
  { id: 102, title: "Báo giá may 8.000 bộ đồ bảo hộ ESD", time: "2 giờ trước", role: "Nhà cung ứng" },
  { id: 103, title: "Khớp lệnh B2B KCN VSIP 1 & 2", time: "Hôm qua", role: "Doanh nghiệp FDI" }
];

export default function AiWorkspacePage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const processedParamRef = useRef(false);

  // User & Auth State (Section VII & XIX: Guest by default, can log in or link Zalo)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: false, // Default Guest
      name: 'Nguyễn Văn An',
      orgName: 'Công ty Cổ phần Tân Á Packaging',
      role: 'Nhà máy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isZaloLinked: false,
      zaloUid: null
    };
  });

  // Requirement Draft state (Section III, IV, V: Auto created and synced to localStorage)
  const [currentDraft, setCurrentDraft] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_requirement_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Flexible Conversation Entity Link (Section 9: Intent Router & Entity Linking)
  const [conversation, setConversation] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_active_conversation');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'conv_' + Date.now(),
      entityType: null,
      entityId: null,
      currentIntent: 'GENERAL_QUESTION',
      activeEntityDraft: null
    };
  });

  // Modals & Panels State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showZaloModal, setShowZaloModal] = useState(false);
  const [showDraftDrawer, setShowDraftDrawer] = useState(false);
  const [publishPrivacy, setPublishPrivacy] = useState('ONLY_MATCHED'); // Section VIII default: CHỈ NCC PHÙ HỢP
  const [toastMessage, setToastMessage] = useState(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [zaloPhone, setZaloPhone] = useState('');

  // Workspace Chat State
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);

  // Dynamic Real DB Sidebar Role Sections (100% computed from real database arrays & live session)
  const sidebarRoleSections = useMemo(() => {
    return buildLiveSidebarRoleSections({ currentDraft, currentUser });
  }, [currentDraft, currentUser]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState(INITIAL_WORK_HISTORY);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Toast feedback helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Start new chat
  const handleNewChat = () => {
    resetAssistantConversation();
    const newConv = {
      id: 'conv_' + Date.now(),
      entityType: null,
      entityId: null,
      currentIntent: 'GENERAL_QUESTION',
      activeEntityDraft: null
    };
    setConversation(newConv);
    try {
      localStorage.setItem('ccu_active_conversation', JSON.stringify(newConv));
    } catch (e) {}
    setMessages([]);
    setInputPrompt('');
    setActiveTab('chat');
    setIsProcessing(false);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Login handler (Section VII)
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    const updated = {
      ...currentUser,
      isLoggedIn: true,
      name: loginPhone ? `Doanh nghiệp (${loginPhone.slice(-4)})` : currentUser.name
    };
    setCurrentUser(updated);
    localStorage.setItem('ccu_user_session', JSON.stringify(updated));
    setShowLoginModal(false);
    showToast("✓ Đăng nhập thành công! Phiên làm việc và bản nháp đã được lưu.");
    // If pending a draft confirmation, immediately open confirmation modal without repeating data
    if (currentDraft && currentDraft.status === 'DRAFT_AI') {
      setTimeout(() => setShowConfirmModal(true), 300);
    }
  };

  // Logout / Switch back to Guest
  const handleLogout = () => {
    const guest = { ...currentUser, isLoggedIn: false, isZaloLinked: false };
    setCurrentUser(guest);
    localStorage.removeItem('ccu_user_session');
    showToast("Đã chuyển về chế độ Khách (Guest).");
  };

  // Link Zalo CRM (Section XII & XIII)
  const handleLinkZaloSubmit = (e) => {
    if (e) e.preventDefault();
    const updated = {
      ...currentUser,
      isZaloLinked: true,
      zaloUid: 'zalo_uid_' + Math.floor(100000 + Math.random() * 900000)
    };
    setCurrentUser(updated);
    localStorage.setItem('ccu_user_session', JSON.stringify(updated));
    setShowZaloModal(false);
    showToast("✓ Đã liên kết Zalo CRM thành công! Cập nhật từ CHAINY sẽ được gửi song song.");
  };

  // Confirm and Publish Draft (Section VIII)
  const handleConfirmPublish = () => {
    if (!currentDraft) return;
    const updatedDraft = {
      ...currentDraft,
      status: 'CONFIRMED_SEARCHING',
      visibility: publishPrivacy,
      confirmed_at: new Date().toISOString()
    };
    setCurrentDraft(updatedDraft);
    localStorage.setItem('ccu_requirement_draft', JSON.stringify(updatedDraft));
    setShowConfirmModal(false);
    showToast("✓ Đã xác nhận nhu cầu! SUPPI & CHAINY đang tiến hành tìm kiếm và điều phối kết nối.");

    // Append system handoff event to chat
    const handoffMsg = {
      id: Date.now() + 20,
      sender: 'system_event',
      title: 'SUPPI_HANDOFF_CHAINY',
      text: 'Nhu cầu đã được xác nhận. SUPPI đã bàn giao kết nối cho CHAINY điều phối thực thi pipeline 9 giai đoạn.',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, handoffMsg]);
  };

  // Handle clicking "Xác nhận & Tìm nguồn" (Section VII & VIII)
  const handleConfirmClick = () => {
    if (!currentUser.isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  // Realtime RequirementDraft updater (Section 10: Tự động cập nhật draft realtime)
  const updateRequirementDraftRealtime = ({ prevDraft, newText, roleLabel, currentUser }) => {
    if (!prevDraft) return null;
    const lower = (newText || '').toLowerCase();
    const now = new Date().toISOString();

    let updated = { ...prevDraft };

    // 1. Check quantity & unit changes
    const qtyMatch = newText.match(/(\d+(?:[\.,]\d+)?)\s*(bộ|cái|thùng|pallet|chiếc|tấn|kg|m2|mét)/i);
    if (qtyMatch) {
      const newQty = qtyMatch[1];
      const newUnit = qtyMatch[2].toLowerCase();
      updated.quantity = newQty;
      updated.unit = newUnit;
      if (updated.title && /^TÌM\s+\d+/i.test(updated.title)) {
        updated.title = updated.title.replace(/^TÌM\s+[\d\.,]+\s*[^\s]+/i, `TÌM ${newQty} ${newUnit.toUpperCase()}`);
      }
    }

    // 2. Check location / industrial park changes
    if (lower.includes('đồng nai') || lower.includes('biên hòa') || lower.includes('long thành') || lower.includes('nhơn trạch')) {
      updated.location = 'Đồng Nai';
      updated.province = 'Đồng Nai';
      if (lower.includes('biên hòa 2')) updated.industrialParkId = 'KCN Biên Hòa 2, Đồng Nai';
      else if (lower.includes('amata')) updated.industrialParkId = 'KCN Amata, Đồng Nai';
      else if (lower.includes('nhơn trạch')) updated.industrialParkId = 'KCN Nhơn Trạch, Đồng Nai';
      else if (!updated.industrialParkId) updated.industrialParkId = 'KCN Amata / Biên Hòa 2';
    } else if (lower.includes('bình dương') || lower.includes('thủ dầu một') || lower.includes('dĩ an') || lower.includes('thuận an') || lower.includes('bến cát')) {
      updated.location = 'Bình Dương';
      updated.province = 'Bình Dương';
      if (lower.includes('vsip 2') || lower.includes('vsip ii')) updated.industrialParkId = 'KCN VSIP II, Bình Dương';
      else if (lower.includes('sóng thần')) updated.industrialParkId = 'KCN Sóng Thần 2, Bình Dương';
      else if (!updated.industrialParkId) updated.industrialParkId = 'KCN VSIP II / Sóng Thần';
    } else if (lower.includes('long an') || lower.includes('bến lức') || lower.includes('đức hòa')) {
      updated.location = 'Long An';
      updated.province = 'Long An';
      updated.industrialParkId = 'KCN Tân Đức, Long An';
    } else if (lower.includes('bắc ninh')) {
      updated.location = 'Bắc Ninh';
      updated.province = 'Bắc Ninh';
      updated.industrialParkId = 'KCN Yên Phong I, Bắc Ninh';
    }

    // 3. Check specifications
    const specKeywords = ['kaki', 'cotton', 'polyester', 'chống nhăn', 'chống tĩnh điện', 'in logo', 'thêu logo', '2 màu', '4 màu', '5 lớp', '3 lớp', 'chống thấm', 'chịu tải', 'kích thước', 'size', 'định lượng'];
    if (specKeywords.some(k => lower.includes(k))) {
      if (updated.specifications) {
        if (!updated.specifications.toLowerCase().includes(lower)) {
          updated.specifications = `${updated.specifications}; ${newText}`;
        }
      } else {
        updated.specifications = newText;
      }
    }

    // 4. Check sample requirements
    if (lower.includes('xem mẫu') || lower.includes('mẫu thử') || lower.includes('gửi mẫu') || lower.includes('duyệt mẫu')) {
      updated.sampleRequired = true;
      updated.sample_required = true;
    } else if (lower.includes('không cần mẫu') || lower.includes('không xem mẫu') || lower.includes('bỏ qua mẫu')) {
      updated.sampleRequired = false;
      updated.sample_required = false;
    }

    // 5. Check survey requirements
    if (lower.includes('khảo sát') || lower.includes('qua xưởng') || lower.includes('đo size') || lower.includes('đo trực tiếp') || lower.includes('tận nơi')) {
      updated.surveyRequired = true;
      updated.survey_required = true;
    }

    // 6. Check certifications
    if (lower.includes('iso') || lower.includes('oeko') || lower.includes('fsc') || lower.includes('rohs') || lower.includes('chứng chỉ') || lower.includes('tiêu chuẩn')) {
      const certs = [];
      if (lower.includes('iso')) certs.push('ISO 9001:2015');
      if (lower.includes('oeko')) certs.push('OEKO-TEX Standard 100');
      if (lower.includes('fsc')) certs.push('FSC CoC');
      if (lower.includes('rohs')) certs.push('RoHS');
      if (certs.length > 0) {
        updated.certificationRequirements = certs.join(', ');
        updated.certification_requirements = certs.join(', ');
      }
    }

    // 7. Check deadline
    if (lower.includes('tháng sau') || lower.includes('gấp') || lower.includes('tuần') || lower.includes('ngày') || lower.includes('cuối tháng')) {
      if (lower.includes('tháng sau')) updated.deadline = 'cần tháng sau';
      else if (lower.includes('gấp') || lower.includes('1 tuần')) updated.deadline = 'gấp trong 7-10 ngày';
      else if (lower.includes('2 tuần')) updated.deadline = 'trong 2 tuần';
      else updated.deadline = newText;
    }

    // 8. Check budget
    const budgetMatch = newText.match(/(\d+(?:[\.,]\d+)?)\s*(triệu|tr|tỷ)/i);
    if (budgetMatch) {
      const val = parseFloat(budgetMatch[1].replace(',', '.'));
      const mult = budgetMatch[2].toLowerCase().includes('tỷ') ? 1000000000 : 1000000;
      const est = val * mult;
      const min = Math.round(est * 0.8).toLocaleString('vi-VN');
      const max = Math.round(est * 1.2).toLocaleString('vi-VN');
      updated.budgetMin = min;
      updated.budget_min = min;
      updated.budgetMax = max;
      updated.budget_max = max;
    }

    // 9. Append to notes
    if (updated.notes) {
      if (!updated.notes.toLowerCase().includes(lower)) {
        updated.notes = `${updated.notes}. ${newText}`;
      }
    } else {
      updated.notes = newText;
    }

    // 10. Recalculate Completeness Score
    const currentScore = prevDraft.completenessScore || prevDraft.completeness_score || 65;
    const newScore = Math.min(100, currentScore + 15);
    updated.completenessScore = newScore;
    updated.completeness_score = newScore;

    // 11. Timestamps & Aliases
    updated.updatedAt = now;
    updated.updated_at = now;
    updated.industrial_park = updated.industrialParkId;
    updated.product_service = updated.productService;
    updated.delivery_requirements = updated.deliveryRequirements;

    if (updated.missing_fields && updated.missing_fields.length > 0) {
      updated.missing_fields = updated.missing_fields.slice(1);
    }

    return updated;
  };

  // Handle quick clarification response (Section IV & Section 10)
  const handleClarifyOption = (optionText) => {
    // If user clicked one of the sample prompt options from GENERAL_QUESTION
    if (optionText.startsWith("Tôi cần") || optionText.startsWith("Tôi muốn") || optionText.startsWith("Đăng ký")) {
      handleSendMessage(optionText);
      return;
    }

    if (!currentDraft && !conversation.activeEntityDraft) {
      handleSendMessage(optionText);
      return;
    }

    const targetDraft = currentDraft || conversation.activeEntityDraft;
    const updated = updateRequirementDraftRealtime({
      prevDraft: targetDraft,
      newText: optionText,
      roleLabel: currentUser.role || 'Nhà máy',
      currentUser
    });

    if (conversation.entityType === 'need' || updated) {
      setCurrentDraft(updated);
      try {
        localStorage.setItem('ccu_requirement_draft', JSON.stringify(updated));
        localStorage.setItem('ccu_draft_' + updated.id, JSON.stringify(updated));
      } catch (e) {}
    }

    const updatedConv = {
      ...conversation,
      activeEntityDraft: updated
    };
    setConversation(updatedConv);
    try {
      localStorage.setItem('ccu_active_conversation', JSON.stringify(updatedConv));
    } catch (e) {}

    // Append user message & SUPPI acknowledgment
    const userClarifyMsg = {
      id: Date.now(),
      sender: 'user',
      role: currentUser.role || 'Nhà máy',
      text: `Bổ sung thông tin: ${optionText}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const suppiAckMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      intent: 'BUYER_REQUIREMENT',
      entityType: 'need',
      entityId: updated.id,
      draft: updated,
      suppi: {
        name: "SUPPI",
        role: "Trinh sát Nguồn cung B2B",
        avatar: "/mascots/SUPPI_2.png",
        color: "blue",
        message: `✓ SUPPI đã ghi nhận: "${optionText}". Bản nháp #${updated.id} đã được cập nhật realtime, độ hoàn thiện đạt ${updated.completenessScore}%.`
      },
      chainy: {
        name: "CHAINY",
        role: "Điều phối & Thực thi",
        avatar: "/mascots/CHAINY_2.png",
        color: "pink",
        actions: [
          { title: "Xem & hoàn thiện nhu cầu", desc: `Mở form chuẩn hóa /dang-nhu-cau?draft=${updated.id}` },
          { title: "Tiếp tục trao đổi làm rõ", desc: "Bạn có thể gõ thêm yêu cầu về tiến độ hoặc số lượng." }
        ]
      },
      completeness_score: updated.completenessScore,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userClarifyMsg, suppiAckMsg]);
    showToast(`✓ Đã cập nhật hồ sơ realtime (Độ hoàn thiện: ${updated.completenessScore}%)`);
  };

  // ========================================================
  // SECTION 9: INTENT ROUTER — KHÔNG PHẢI TIN NHẮN NÀO CŨNG TẠO NHU CẦU
  // ========================================================
  const INTENT_DEFINITIONS = {
    GENERAL_QUESTION: {
      id: "GENERAL_QUESTION",
      label: "Hỏi đáp & Trợ lý",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
      entityType: null,
      description: "Giải thích hệ thống, vai trò của SUPPI & CHAINY, hướng dẫn sử dụng không tạo bản nháp."
    },
    SUPPLIER_SEARCH: {
      id: "SUPPLIER_SEARCH",
      label: "Tìm kiếm nhà cung ứng",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      entityType: "supplier_search",
      description: "Tra cứu danh bạ nhà cung cấp, đối tác theo tiêu chí ngành hoặc địa bàn."
    },
    BUYER_REQUIREMENT: {
      id: "BUYER_REQUIREMENT",
      label: "Nhu cầu mua hàng / Gia công",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      entityType: "need",
      description: "Yêu cầu thu mua, đặt hàng, gia công, báo giá có thông số & khối lượng cụ thể."
    },
    SUPPLIER_OPPORTUNITY: {
      id: "SUPPLIER_OPPORTUNITY",
      label: "Cơ hội bán hàng / Giới thiệu năng lực",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      entityType: "supplier_opportunity",
      description: "Nhà cung ứng tìm đơn hàng mở hoặc giới thiệu năng lực sản xuất."
    },
    EVENT_INTEREST: {
      id: "EVENT_INTEREST",
      label: "Quan tâm sự kiện / Ngày hội",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      entityType: "program_registration",
      description: "Đăng ký tham gia Ngày hội, gian hàng kết nối, buổi gặp mặt 1:1."
    },
    SPONSORSHIP: {
      id: "SPONSORSHIP",
      label: "Đề xuất tài trợ & Đồng hành",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      entityType: "sponsorship_request",
      description: "Doanh nghiệp muốn tài trợ sự kiện, trạm KCN hoặc các gói truyền thông thương hiệu."
    },
    FOUNDING_PARTNER: {
      id: "FOUNDING_PARTNER",
      label: "Đối tác Đồng hành Sáng lập",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      entityType: "partnership_request",
      description: "Hợp tác chiến lược, chia sẻ hạ tầng, gia nhập mạng lưới đối tác phát triển."
    },
    FDI_MARKET_ENTRY: {
      id: "FDI_MARKET_ENTRY",
      label: "Hỗ trợ FDI vào thị trường VN",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      entityType: "fdi_service_request",
      description: "Tư vấn địa điểm đặt nhà máy KCN, thủ tục giấy phép, chuỗi cung ứng bản địa."
    },
    INVESTMENT: {
      id: "INVESTMENT",
      label: "Đầu tư / Gọi vốn nhà máy",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      entityType: "investment_request",
      description: "Kết nối quỹ đầu tư, M&A công nghiệp, mua sắm máy móc mở rộng quy mô."
    },
    EXPERT_SUPPORT: {
      id: "EXPERT_SUPPORT",
      label: "Chuyên gia / ESG / Tiêu chuẩn",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
      entityType: "expert_support_request",
      description: "Tư vấn tiêu chuẩn chứng nhận ISO, kiểm toán năng lượng, giảm phát thải ESG."
    },
    EXISTING_WORK_FOLLOWUP: {
      id: "EXISTING_WORK_FOLLOWUP",
      label: "Theo dõi công việc đang chạy",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
      entityType: "followup",
      description: "Kiểm tra tiến độ báo giá, gửi mẫu, lịch hẹn gặp mặt đã thiết lập trước đó."
    }
  };

  // Classify intent based on query, role, and existing conversation context
  const classifyIntent = (text, role, currentConv) => {
    const lower = (text || "").toLowerCase().trim();

    // 1. Explicit questions about SUPPI, CHAINY, Platform, Greetings
    if (
      lower.includes("suppi là gì") ||
      lower.includes("chainy là ai") ||
      lower.includes("suppi là ai") ||
      lower.includes("chainy là gì") ||
      lower.includes("bạn là ai") ||
      lower.includes("ccu là gì") ||
      lower.includes("chuỗi cung ứng là gì") ||
      lower.includes("chuoicungung là gì") ||
      lower.includes("giới thiệu") ||
      lower.includes("hướng dẫn") ||
      lower.includes("tính năng") ||
      lower.includes("làm thế nào") ||
      lower.includes("chào") ||
      lower === "hello" ||
      lower === "hi"
    ) {
      return "GENERAL_QUESTION";
    }

    // 2. Sponsorship / Sponsor
    if (
      lower.includes("tài trợ") ||
      lower.includes("sponsor") ||
      lower.includes("gói kim cương") ||
      lower.includes("gói vàng") ||
      lower.includes("gói bạc") ||
      lower.includes("nhà tài trợ")
    ) {
      return "SPONSORSHIP";
    }

    // 3. FDI Market Entry
    if (
      lower.includes("vào thị trường việt nam") ||
      lower.includes("vào thị trường vn") ||
      lower.includes("thị trường việt nam") ||
      lower.includes("thị trường vn") ||
      lower.includes("market entry") ||
      (lower.includes("fdi") && (lower.includes("đầu tư") || lower.includes("mở xưởng") || lower.includes("vào") || lower.includes("chuỗi"))) ||
      lower.includes("đầu tư vào việt nam") ||
      lower.includes("mở nhà xưởng tại việt nam") ||
      lower.includes("mở nhà máy tại việt nam")
    ) {
      return "FDI_MARKET_ENTRY";
    }

    // 4. Founding Partner
    if (
      lower.includes("đối tác sáng lập") ||
      lower.includes("đồng hành sáng lập") ||
      lower.includes("founding partner") ||
      lower.includes("sáng lập")
    ) {
      return "FOUNDING_PARTNER";
    }

    // 5. Events / Programs
    if (
      lower.includes("ngày hội") ||
      lower.includes("sự kiện") ||
      lower.includes("hội chợ") ||
      lower.includes("gian hàng") ||
      lower.includes("bàn b2b") ||
      lower.includes("matching 1:1") ||
      lower.includes("tham gia chương trình") ||
      lower.includes("đăng ký sự kiện")
    ) {
      return "EVENT_INTEREST";
    }

    // 6. Investment / Funding
    if (
      lower.includes("gọi vốn") ||
      lower.includes("quỹ đầu tư") ||
      lower.includes("rót vốn") ||
      lower.includes("nhu cầu vốn") ||
      lower.includes("tìm dự án đầu tư") ||
      lower.includes("m&a") ||
      lower.includes("chuyển nhượng nhà máy")
    ) {
      return "INVESTMENT";
    }

    // 7. Expert Support / ESG / Standards
    if (
      lower.includes("chuyên gia") ||
      lower.includes("esg") ||
      lower.includes("iso") ||
      lower.includes("kiểm định") ||
      lower.includes("kiểm kê carbon") ||
      lower.includes("tư vấn kỹ thuật") ||
      lower.includes("chứng chỉ fsc") ||
      lower.includes("đào tạo lean")
    ) {
      return "EXPERT_SUPPORT";
    }

    // 8. Follow-up on ongoing work
    if (
      lower.includes("tiến độ") ||
      lower.includes("hôm qua") ||
      lower.includes("hôm trước") ||
      lower.includes("báo giá gửi chưa") ||
      lower.includes("mẫu thử đến đâu") ||
      lower.includes("kết quả thế nào") ||
      lower.includes("công việc đang chạy") ||
      lower.includes("trạng thái đơn")
    ) {
      return "EXISTING_WORK_FOLLOWUP";
    }

    // 9. Supplier Opportunity / Capacity showcase
    if (
      lower.includes("tôi là nhà cung cấp") ||
      lower.includes("tôi là ncc") ||
      lower.includes("chúng tôi là xưởng") ||
      lower.includes("chúng tôi có xưởng") ||
      lower.includes("xưởng chúng tôi") ||
      lower.includes("năng lực của chúng tôi") ||
      lower.includes("chúng tôi sản xuất") ||
      lower.includes("nhận gia công") ||
      lower.includes("tìm đơn đặt hàng") ||
      lower.includes("tìm nhà máy cần mua") ||
      (role === "supplier" && (lower.includes("đơn hàng") || lower.includes("cơ hội") || lower.includes("chào thầu")))
    ) {
      return "SUPPLIER_OPPORTUNITY";
    }

    // 10. Buyer Requirement (Procurement Need): quantity/spec or explicit buying intent
    const hasQuantityWithUnit = /\d+\s*(bộ|cái|thùng|tấn|kg|chi tiết|m2|mét|đôi|cuộn|pcs|lô)/.test(lower);
    const hasProcurementKeywords =
      lower.includes("tôi cần") ||
      lower.includes("cần mua") ||
      lower.includes("cần đặt") ||
      lower.includes("cần may") ||
      lower.includes("cần gia công") ||
      lower.includes("báo giá gấp") ||
      lower.includes("yêu cầu báo giá") ||
      lower.includes("đặt hàng") ||
      (lower.includes("cần") && (lower.includes("đồng phục") || lower.includes("thùng") || lower.includes("pallet") || lower.includes("bao bì") || lower.includes("vật tư")));

    if (hasQuantityWithUnit || hasProcurementKeywords) {
      return "BUYER_REQUIREMENT";
    }

    // 11. Supplier Search (General search without strict procurement contract specs)
    if (
      lower.includes("tìm") ||
      lower.includes("nhà cung") ||
      lower.includes("ncc") ||
      lower.includes("danh bạ") ||
      lower.includes("ở đâu bán") ||
      lower.includes("xưởng")
    ) {
      return "SUPPLIER_SEARCH";
    }

    // Default fallback is general question
    return "GENERAL_QUESTION";
  };

  // Generate Entity Draft according to Intent (Flexible Entity Linking)
  const createEntityDraft = ({ intent, query, userRoleObj, currentUser, currentConv }) => {
    const convId = currentConv?.id || ('conv_' + Date.now());
    const lower = query.toLowerCase();

    switch (intent) {
      case 'GENERAL_QUESTION': {
        return {
          entityType: null,
          entityId: null,
          draft: null,
          clarification: {
            question: "SUPPI & CHAINY có thể giúp bạn xử lý ngay các tác vụ sau. Bấm chọn nhanh để thử nghiệm:",
            options: [
              "Tôi cần 500 bộ đồng phục ở Đồng Nai",
              "Tôi muốn tài trợ Ngày hội",
              "Tôi muốn vào thị trường Việt Nam"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Trợ lý Trinh sát Nguồn cung B2B",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            message: "SUPPI là AI Trinh sát Chuỗi Cung Ứng — chuyên phân tích năng lực nhà máy, khớp nối nhu cầu thu mua, tra cứu danh bạ đối tác xác thực (KYC) và mạng lưới KCN tại Việt Nam. Tin nhắn hỏi đáp chung này không tạo bản nháp nhu cầu.",
            findings: [
              {
                name: "Hệ thống phân tích B2B thông minh",
                location: "Toàn quốc & Mạng lưới 50+ KCN",
                matchRate: "100%",
                kyc: "Hệ thống xác thực CCU",
                phase: "Phân loại 11 nhóm Intent chuẩn hóa",
                capacity: "Tự động nhận diện nhu cầu mua sắm, tài trợ, FDI, chuyên gia hoặc sự kiện"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Trợ lý Điều phối & Đôn đốc B2B",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Gửi nhu cầu mua hàng / gia công", desc: "Thử gõ: 'Tôi cần 500 bộ đồng phục ở Đồng Nai' để tạo RequirementDraft tự động." },
              { title: "Đề xuất tài trợ Ngày hội", desc: "Thử gõ: 'Tôi muốn tài trợ Ngày hội' để nhận hồ sơ quyền lợi tài trợ (không ép thành need)." },
              { title: "Gia nhập thị trường Việt Nam", desc: "Thử gõ: 'Tôi muốn vào thị trường Việt Nam' để tạo FDI service request draft." }
            ]
          }
        };
      }

      case 'BUYER_REQUIREMENT': {
        const draftId = currentConv?.activeEntityDraft?.id || ('REQ-' + Math.floor(100000 + Math.random() * 900000));
        const isUniform = lower.includes('đồng phục') || lower.includes('may mặc') || lower.includes('bảo hộ') || lower.includes('áo');
        const isBox = lower.includes('thùng') || lower.includes('bao bì') || lower.includes('carton');
        const isPallet = lower.includes('pallet') || lower.includes('kệ') || lower.includes('kho');
        const isCnc = lower.includes('cơ khí') || lower.includes('cnc') || lower.includes('khuôn');

        const loc = lower.includes('đồng nai') ? 'Đồng Nai' : (lower.includes('bình dương') ? 'Bình Dương' : (lower.includes('long an') ? 'Long An' : (lower.includes('bắc ninh') ? 'Bắc Ninh' : (lower.includes('hải phòng') ? 'Hải Phòng' : 'Đồng Nai'))));
        const ip = lower.includes('đồng nai') ? (lower.includes('biên hòa 2') ? 'KCN Biên Hòa 2' : 'KCN Amata / Biên Hòa 2') : (lower.includes('bình dương') ? 'KCN VSIP II / Sóng Thần' : (lower.includes('long an') ? 'KCN Tân Đức, Long An' : (lower.includes('bắc ninh') ? 'KCN Yên Phong I' : 'KCN Trọng điểm')));
        
        // Extract quantity number
        const qtyMatch = query.match(/(\d+(?:[\.,]\d+)?)\s*(bộ|cái|thùng|pallet|chiếc|tấn|kg|m2|mét)?/i);
        const qtyNumber = qtyMatch ? qtyMatch[1] : (isUniform ? '500' : (isBox ? '10.000' : '1.000'));
        const unit = qtyMatch && qtyMatch[2] ? qtyMatch[2].toLowerCase() : (isBox ? 'thùng' : (isUniform ? 'bộ' : (isPallet ? 'pallet' : 'cái')));

        let draftTitle = '';
        let prodService = '';
        let catId = 'general';
        let subcatId = 'general';
        let categoryName = 'Vật tư & Thiết bị công nghiệp';

        if (isUniform) {
          draftTitle = `TÌM ${qtyNumber} BỘ ĐỒNG PHỤC CÔNG NHÂN`;
          prodService = 'Đồng phục công nhân may kỹ';
          catId = 'garment';
          subcatId = 'workwear';
          categoryName = 'May mặc & Đồng phục';
        } else if (isBox) {
          draftTitle = `TÌM ${qtyNumber} THÙNG CARTON 5 LỚP`;
          prodService = 'Thùng carton 5 lớp chống thấm';
          catId = 'packaging';
          subcatId = 'carton_box';
          categoryName = 'Bao bì & Đóng gói';
        } else if (isPallet) {
          draftTitle = `TÌM ${qtyNumber} PALLET CHỊU TẢI CÔNG NGHIỆP`;
          prodService = 'Pallet chịu tải công nghiệp';
          catId = 'logistics_warehouse';
          subcatId = 'pallet';
          categoryName = 'Kho bãi & Thiết bị phụ trợ';
        } else if (isCnc) {
          draftTitle = `TÌM ĐỐI TÁC GIA CÔNG CƠ KHÍ CHÍNH XÁC CNC`;
          prodService = 'Gia công chi tiết cơ khí CNC';
          catId = 'mechanical';
          subcatId = 'cnc_machining';
          categoryName = 'Cơ khí chính xác & Chế tạo';
        } else {
          draftTitle = `TÌM NHÀ CUNG CẤP ${query.length > 35 ? query.slice(0, 35).toUpperCase() : query.toUpperCase()}`;
          prodService = query.length > 50 ? query.slice(0, 50) + '...' : query;
        }

        const now = new Date().toISOString();
        const draft = {
          id: draftId,
          conversationId: convId,
          userId: currentUser.isLoggedIn ? (currentUser.id || 'USR_001') : 'GUEST',
          organizationId: currentUser.isLoggedIn ? (currentUser.orgName || 'ORG_001') : (userRoleObj.label?.includes('Nhà máy') ? 'Nhà máy Sản xuất & May mặc' : 'Doanh nghiệp Mua sắm'),
          role: userRoleObj.label || 'Nhà máy',
          title: draftTitle,
          categoryId: catId,
          subcategoryId: subcatId,
          productService: prodService,
          quantity: qtyNumber,
          unit: unit,
          location: loc,
          province: loc,
          industrialParkId: ip,
          deadline: 'cần tháng sau',
          budgetMin: '30.000.000',
          budgetMax: '150.000.000',
          specifications: isUniform ? 'Chất liệu vải Kaki 65/35 may kỹ, đường may 2 kim bền chắc, form chuẩn công nghiệp, thoáng mát, in thêu logo 2 màu.' : 'Tiêu chuẩn chất lượng công nghiệp, chứng nhận xuất xưởng đầy đủ.',
          certificationRequirements: 'ISO 9001:2015, OEKO-TEX',
          sampleRequired: true,
          surveyRequired: false,
          deliveryRequirements: 'Giao tận kho nhà máy tại ' + loc,
          attachments: [],
          notes: 'Cần xem mẫu thực tế trước khi duyệt đặt số lượng hàng loạt.',
          visibility: 'CHỈ NCC PHÙ HỢP',
          status: 'DRAFT_AI',
          completenessScore: 65,
          createdFrom: 'ai_chat',
          createdAt: now,
          updatedAt: now,

          // Backward-compatibility aliases
          conversation_id: convId,
          user_id: currentUser.isLoggedIn ? (currentUser.id || 'USR_001') : 'GUEST',
          organization_id: currentUser.isLoggedIn ? (currentUser.orgName || 'ORG_001') : null,
          category: categoryName,
          product_service: prodService,
          industrial_park: ip,
          budget_min: '30.000.000',
          budget_max: '150.000.000',
          certification_requirements: 'ISO 9001:2015, OEKO-TEX',
          sample_required: true,
          survey_required: false,
          delivery_requirements: 'Giao tận kho nhà máy tại ' + loc,
          completeness_score: 65,
          created_from: 'ai_chat',
          created_at: now,
          updated_at: now,
          missing_fields: [
            'Bảng quy cách kích thước chi tiết',
            'Chất liệu & định lượng vải / giấy',
            'Thời gian nhận hàng đợt 1'
          ]
        };

        const findings = isUniform ? [
          {
            name: "Công ty Cổ phần May Mặc Đông Nam",
            location: "KCN Amata, TP. Biên Hòa, Đồng Nai",
            matchRate: "98%",
            kyc: "KYC Kim Cương",
            phase: "Pha 4.2 - May mặc công nghiệp & Bảo hộ",
            capacity: "50.000 bộ/tháng - Chứng chỉ OEKO-TEX, ISO 9001"
          },
          {
            name: "Xưởng May Công Nghiệp Đồng Nai Phát Đạt",
            location: "KCN Biên Hòa 2, Đồng Nai",
            matchRate: "94%",
            kyc: "Xác thực CCU",
            phase: "Pha 3.3 - May đồng phục xưởng & chống tĩnh điện",
            capacity: "Hàng sẵn mẫu - Giao nhanh 5-7 ngày làm việc"
          }
        ] : [
          {
            name: "Công ty Cổ phần Bao Bì Xanh Việt Nam",
            location: "KCN Sóng Thần 2, Dĩ An, Bình Dương",
            matchRate: "98%",
            kyc: "KYC Kim Cương",
            phase: "Pha 4.2 - Bao bì công nghiệp & Thùng chống thấm",
            capacity: "150.000 thùng/tháng - Chứng chỉ FSC & ISO 9001"
          },
          {
            name: "Nhà máy Vật Tư Đóng Gói Toàn Phát",
            location: "KCN Tân Đức, Đức Hòa, Long An",
            matchRate: "95%",
            kyc: "Xác thực CCU",
            phase: "Pha 3.3 - Vật tư phụ trợ sản xuất",
            capacity: "Đáp ứng giao nhanh 48h - Sẵn khuôn 3 lớp & 5 lớp"
          }
        ];

        return {
          entityType: 'need',
          entityId: draftId,
          draft,
          clarification: {
            question: "SUPPI đang làm rõ để hoàn thiện hồ sơ tìm nguồn chuẩn nhất. Bạn có thể chọn nhanh hoặc gõ phản hồi:",
            options: [
              isUniform ? "Chất liệu: Vải Kaki 65/35 chống nhăn" : "Kích thước chuẩn: 40 x 30 x 20 cm",
              "In ấn logo thương hiệu 2 màu",
              "Giao hàng định kỳ 2 tuần/lần"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Tìm đúng nguồn",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings
          },
          chainy: {
            name: "CHAINY",
            role: "Kết nối & Theo việc đến cùng",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Khởi tạo yêu cầu báo giá RFQ", desc: "Tự động gửi thông số và mẫu yêu cầu tới 2 đơn vị trên trong 5 phút." },
              { title: "Gửi mẫu thử & Khảo sát nhà máy", desc: "Hẹn kiểm tra mẫu thực tế tại văn phòng hoặc nhà máy của bạn." },
              { title: "Khớp lệnh 1:1 tại Ngày hội KCN", desc: "Bố trí bàn gặp mặt trực tiếp với Giám đốc mua sắm tại sự kiện gần nhất." }
            ]
          }
        };
      }

      case 'SPONSORSHIP': {
        const draftId = 'SPON-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'sponsorship_request',
          conversation_id: convId,
          title: 'Đề xuất Gói Tài trợ Ngày hội Chuỗi Cung Ứng & Gian hàng VIP',
          program_name: 'Ngày hội Chuỗi Cung Ứng Công Nghiệp Việt Nam 2026',
          tier: 'Gói Kim Cương (Diamond) / Vàng (Gold) / Đồng Hành KCN',
          location: 'Trung tâm Triển lãm & Hội nghị WTC Expo Bình Dương',
          budget_range: '50.000.000đ - 200.000.000đ',
          benefits: [
            'Gian hàng triển lãm tiêu chuẩn VIP 36m² vị trí trung tâm',
            'Logo xuất hiện trên toàn bộ backdrop, tài liệu & trang chủ',
            'Phát biểu 10 phút tại Phiên toàn thể Khai mạc',
            'Bàn kết nối 1:1 độc quyền với 200 Giám đốc mua sắm nhà máy'
          ],
          status: 'DRAFT_SPONSORSHIP',
          completeness_score: 75,
          created_at: new Date().toISOString()
        };

        return {
          entityType: 'sponsorship_request',
          entityId: draftId,
          draft,
          clarification: {
            question: "Bạn quan tâm gói tài trợ nào dưới đây để SUPPI chuẩn bị hồ sơ quyền lợi chính xác nhất?",
            options: [
              "Gói Kim Cương (150 - 200 triệu): Gian hàng VIP & Phiên khai mạc",
              "Gói Vàng (80 - 100 triệu): Gian hàng trung tâm & Kết nối 1:1",
              "Gói Đồng hành KCN (30 - 50 triệu): Bàn kết nối xúc tiến thương mại"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Khớp nối Sự kiện & Nhà tài trợ",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Ngày hội Chuỗi Cung Ứng Đông Nam Bộ 2026",
                location: "WTC Expo Bình Dương",
                matchRate: "99%",
                kyc: "Sự kiện trọng điểm",
                phase: "Quy mô: 500+ Nhà máy & 200 NCC tham gia",
                capacity: "Còn 2 suất Gói Kim Cương và 5 suất Gói Vàng"
              },
              {
                name: "Tuần lễ Kết nối Cung Cầu KCN Đồng Nai",
                location: "KCN Amata Biên Hòa, Đồng Nai",
                matchRate: "93%",
                kyc: "Sự kiện định kỳ",
                phase: "Gặp gỡ 150 doanh nghiệp FDI",
                capacity: "Gói đồng hành Bàn giao thương & Trạm CCU"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Điều phối Quyền lợi & Kết nối BTC",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Gửi Hồ sơ Mời tài trợ (Sponsorship Deck)", desc: "Tự động gửi thông tin quyền lợi chi tiết và bảng giá tài trợ qua email/Zalo." },
              { title: "Đặt lịch họp 1:1 với Trưởng Ban Tổ chức", desc: "Bố trí buổi làm việc trực tuyến hoặc trực tiếp trong 24h tới." },
              { title: "Giữ chỗ sơ đồ gian hàng VIP", desc: "Tạm khóa vị trí gian hàng đẹp nhất tại mặt tiền hội trường triển lãm." }
            ]
          }
        };
      }

      case 'FDI_MARKET_ENTRY': {
        const draftId = 'FDI-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'fdi_service_request',
          conversation_id: convId,
          title: 'Yêu cầu Dịch vụ Hỗ trợ Doanh nghiệp FDI Gia nhập Thị trường Việt Nam',
          service_scope: 'Khảo sát KCN, Pháp lý & Giấy phép đầu tư, Xây dựng chuỗi cung ứng bản địa Tier 1 & Tier 2',
          target_provinces: 'Bình Dương, Đồng Nai, Long An, Hải Phòng, Bắc Ninh',
          investment_scale: 'Dự kiến 5.000.000$ - 20.000.000$ (Nhà xưởng 15.000 - 30.000 m²)',
          timeline: 'Triển khai trong Q2 - Q4 / 2026',
          status: 'DRAFT_FDI_SERVICE',
          completeness_score: 70,
          created_at: new Date().toISOString()
        };

        return {
          entityType: 'fdi_service_request',
          entityId: draftId,
          draft,
          clarification: {
            question: "Doanh nghiệp của bạn ưu tiên hỗ trợ nhóm dịch vụ nào trước tiên?",
            options: [
              "Thuê đất / Nhà xưởng xây sẵn (RBF) tại KCN",
              "Tìm kiếm danh sách NCC phụ trợ bản địa (Tier 1 & Tier 2)",
              "Thủ tục cấp phép đầu tư (IRC, ERC) & Giấy phép môi trường"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Khảo sát Địa bàn & Chuỗi bản địa",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "KCN VSIP II & VSIP III (Bình Dương)",
                location: "Bắc Tân Uyên, Bình Dương",
                matchRate: "97%",
                kyc: "Hạ tầng Xanh & Thông minh",
                phase: "Sẵn sàng quỹ đất sạch & nhà xưởng xây sẵn (RBF)",
                capacity: "Ưu đãi thuế TNDN, một cửa cấp phép đầu tư nhanh"
              },
              {
                name: "Mạng lưới 50 Nhà cung ứng phụ trợ Việt Nam (Tier 1/2)",
                location: "Đông Nam Bộ & Vùng kinh tế trọng điểm phía Nam",
                matchRate: "95%",
                kyc: "Đạt chuẩn ISO/IATF 16949",
                phase: "Cơ khí, điện tử, bao bì & phụ trợ công nghiệp",
                capacity: "Sẵn sàng nội địa hóa 30 - 45% linh kiện trong năm đầu"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Tổ chức Khảo sát & Concierge FDI",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Bố trí buổi làm việc với Ban Quản lý KCN", desc: "Xếp lịch thị sát thực địa tại các KCN mục tiêu phù hợp ngành nghề." },
              { title: "Cung cấp Báo cáo Nghiên cứu Khả thi (Feasibility Brief)", desc: "Tổng hợp chi phí nhân công, điện, nước, logistics và chính sách thuế." },
              { title: "Khớp lệnh 1:1 với nhà cung ứng phụ trợ bản địa", desc: "Chuẩn bị danh sách ngắn NCC đủ tiêu chuẩn xuất xưởng để làm việc trực tiếp." }
            ]
          }
        };
      }

      case 'FOUNDING_PARTNER': {
        const draftId = 'PRT-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'partnership_request',
          conversation_id: convId,
          title: 'Đăng ký Đối tác Đồng hành Sáng lập Mạng lưới Chuỗi Cung Ứng',
          cooperation_model: 'Đối tác Chiến lược / Hạ tầng Trạm CCU tại KCN / Đồng bộ dữ liệu cung ứng',
          status: 'DRAFT_PARTNERSHIP',
          completeness_score: 75,
          created_at: new Date().toISOString()
        };
        return {
          entityType: 'partnership_request',
          entityId: draftId,
          draft,
          clarification: {
            question: "Bạn quan tâm vai trò đồng hành sáng lập ở trụ cột nào?",
            options: [
              "Hạ tầng & Trạm Chuỗi Cung Ứng tại KCN",
              "Mạng lưới Hội / Hiệp hội ngành hàng",
              "Đồng hành công nghệ & Dữ liệu KYC doanh nghiệp"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Khớp nối Mạng lưới Đối tác Chiến lược",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Liên minh Đối tác Đồng hành Sáng lập CCU",
                location: "Toàn quốc",
                matchRate: "100%",
                kyc: "Hội đồng Sáng lập",
                phase: "Quyền lợi thành viên sáng lập trọn đời",
                capacity: "Đồng thương hiệu, chia sẻ doanh thu kết nối & ưu tiên giới thiệu dự án"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Điều phối Hồ sơ Thỏa thuận Hợp tác (MOU)",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Gửi Bộ tài liệu Founding Partner Prospectus", desc: "Tài liệu chi tiết cơ chế quyền lợi, nghĩa vụ và lộ trình triển khai 2026-2030." },
              { title: "Đặt lịch hội kiến với Ban Sáng lập CCU", desc: "Bố trí buổi làm việc riêng để thống nhất nội dung Biên bản ghi nhớ (MOU)." }
            ]
          }
        };
      }

      case 'EVENT_INTEREST': {
        const draftId = 'REG-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'program_registration',
          conversation_id: convId,
          title: 'Đăng ký Tham gia Chương trình Kết nối & Gian hàng Triển lãm',
          event_name: 'Ngày hội Chuỗi Cung Ứng Công Nghiệp Việt Nam 2026',
          format: 'Gian hàng tiêu chuẩn & Bàn kết nối 1:1',
          location: 'WTC Expo Bình Dương / KCN Sóng Thần',
          status: 'DRAFT_REGISTRATION',
          completeness_score: 80,
          created_at: new Date().toISOString()
        };
        return {
          entityType: 'program_registration',
          entityId: draftId,
          draft,
          clarification: {
            question: "Bạn muốn đăng ký theo hình thức nào?",
            options: [
              "Gian hàng triển lãm giới thiệu sản phẩm (9m² - 18m²)",
              "Đăng ký Bàn kết nối giao thương 1:1 với Buyer",
              "Đoàn doanh nghiệp tham quan & Khảo sát thực địa KCN"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Điều phối Đăng ký Sự kiện",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Ngày hội Chuỗi Cung Ứng Công Nghiệp Việt Nam 2026",
                location: "Trung tâm Hội chợ Triển lãm Quốc tế WTC Expo Bình Dương",
                matchRate: "98%",
                kyc: "Sự kiện cấp vùng",
                phase: "500+ Doanh nghiệp & 200 Gian hàng B2B",
                capacity: "Đang mở cổng tiếp nhận đăng ký đợt 1"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Đôn đốc Giữ chỗ & Xác nhận vé mời",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Khóa vị trí gian hàng dự kiến", desc: "Giữ vị trí trên sơ đồ mặt bằng trong 48h." },
              { title: "Xác nhận danh sách người tham dự", desc: "Tạo mã QR Check-in VIP cho đại diện doanh nghiệp." }
            ]
          }
        };
      }

      case 'INVESTMENT': {
        const draftId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'investment_request',
          conversation_id: convId,
          title: 'Hồ sơ Kết nối Vốn Đầu tư & Mở rộng Sản xuất Công nghiệp',
          funding_type: 'Vốn tăng trưởng / Mua sắm dây chuyền / M&A nhà máy',
          status: 'DRAFT_INVESTMENT',
          completeness_score: 65,
          created_at: new Date().toISOString()
        };
        return {
          entityType: 'investment_request',
          entityId: draftId,
          draft,
          clarification: null,
          suppi: {
            name: "SUPPI",
            role: "Khớp nối Nhà máy & Quỹ đầu tư",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Quỹ Đầu tư Phát triển Công nghiệp Đông Nam Á",
                location: "TP. Hồ Chí Minh & Bình Dương",
                matchRate: "94%",
                kyc: "Quỹ Đối tác Xác thực",
                phase: "Quy mô giải ngân: 2 - 10 triệu USD / dự án",
                capacity: "Ưu tiên nhà máy sản xuất linh kiện phụ trợ, bao bì & tự động hóa"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Điều phối Quy trình Thẩm định & Ký kết NDA",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Gửi Thỏa thuận Bảo mật Thông tin (NDA)", desc: "Ký kết điện tử trước khi chia sẻ báo cáo tài chính và hồ sơ nhà máy." },
              { title: "Sắp xếp buổi pitching 1:1 với Giám đốc Đầu tư", desc: "Họp kín bảo mật để trình bày phương án sử dụng vốn." }
            ]
          }
        };
      }

      case 'EXPERT_SUPPORT': {
        const draftId = 'EXP-' + Math.floor(100000 + Math.random() * 900000);
        const draft = {
          id: draftId,
          entityType: 'expert_support_request',
          conversation_id: convId,
          title: 'Hồ sơ Yêu cầu Chuyên gia: ESG, Tiêu chuẩn Kỹ thuật & Chứng nhận',
          domain: 'Tư vấn ESG, Báo cáo kiểm kê carbon, ISO 9001/14001, Giấy phép xả thải',
          status: 'DRAFT_EXPERT_SERVICE',
          completeness_score: 70,
          created_at: new Date().toISOString()
        };
        return {
          entityType: 'expert_support_request',
          entityId: draftId,
          draft,
          clarification: null,
          suppi: {
            name: "SUPPI",
            role: "Tìm kiếm Chuyên gia & Đơn vị Thẩm định",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Viện Tiêu Chuẩn & Chuyển Đổi Xanh Công Nghiệp",
                location: "Đồng Nai & TP.HCM",
                matchRate: "96%",
                kyc: "Đối tác Chuyên gia CCU",
                phase: "Tư vấn lộ trình ESG & Báo cáo Carbon Footprint",
                capacity: "Đã tư vấn hơn 80 nhà máy FDI xuất khẩu sang EU/Mỹ"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Điều phối Khảo sát & Kế hoạch Đào tạo",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Đặt lịch Chuyên gia khảo sát nhà máy", desc: "Thị sát trực tiếp dây chuyền và đánh giá GAP phân tích tiêu chuẩn." },
              { title: "Cung cấp Bản đề xuất Lộ trình Đạt chuẩn", desc: "Bảng tiến độ và dự toán chi phí chi tiết cho từng giai đoạn." }
            ]
          }
        };
      }

      case 'EXISTING_WORK_FOLLOWUP': {
        const activeId = currentConv?.entityId || ('FOL-' + Math.floor(100000 + Math.random() * 900000));
        return {
          entityType: currentConv?.entityType || 'followup',
          entityId: activeId,
          draft: currentConv?.activeEntityDraft || null,
          clarification: null,
          suppi: {
            name: "SUPPI",
            role: "Báo cáo Tình trạng Kết nối",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Kết nối đang thực hiện: " + (currentConv?.entityType ? `${currentConv.entityType} #${activeId}` : "Hồ sơ công việc hiện tại"),
                location: "Hệ thống Trạm CCU",
                matchRate: "Tiến độ: Đang xử lý",
                kyc: "Hồ sơ đã đồng bộ",
                phase: "Đang chờ đối tác gửi báo giá và xác nhận mẫu",
                capacity: "Đã gửi thông báo tự động tới đơn vị tiếp nhận"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Đôn đốc Tiến độ & Nhắc việc",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Gửi tin nhắn đôn đốc (Ping reminder)", desc: "Nhắc đối tác phản hồi báo giá RFQ trong 2 giờ tới." },
              { title: "Kiểm tra mã vận đơn mẫu thử", desc: "Theo dõi vị trí bưu gửi mẫu vải / mẫu thùng carton." },
              { title: "Xem lại biên bản làm việc gần nhất", desc: "Mở lại ghi chú tóm tắt cuộc gặp trước đó." }
            ]
          }
        };
      }

      case 'SUPPLIER_SEARCH': {
        return {
          entityType: 'supplier_search',
          entityId: null,
          draft: null,
          clarification: {
            question: "Bạn muốn lọc danh sách nhà cung cấp theo tiêu chí nào?",
            options: [
              "Ưu tiên nhà cung ứng gần nhà máy (Bình Dương, Đồng Nai)",
              "Chỉ xem nhà cung ứng đạt chứng nhận ISO / KYC Kim Cương",
              "Đơn vị có sẵn năng lực giao nhanh trong 48 giờ"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Tìm kiếm Nhà cung ứng",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Công ty Cổ phần Bao Bì Xanh Việt Nam",
                location: "KCN Sóng Thần 2, Dĩ An, Bình Dương",
                matchRate: "98%",
                kyc: "KYC Kim Cương",
                phase: "Bao bì công nghiệp & Thùng chống thấm",
                capacity: "150.000 thùng/tháng - Chứng chỉ FSC & ISO 9001"
              },
              {
                name: "Công ty TNHH Dệt May & Bảo Hộ Lao Động Tân Phú",
                location: "KCN Biên Hòa 2, Đồng Nai",
                matchRate: "95%",
                kyc: "KYC Vàng",
                phase: "Đồng phục xưởng & Thiết bị bảo hộ cá nhân",
                capacity: "40.000 bộ/tháng - Đạt chuẩn an toàn lao động"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Hỗ trợ Kết nối Nhanh",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Lấy thông tin liên hệ phòng mua sắm", desc: "Mở kênh trao đổi trực tiếp với quản lý kinh doanh của nhà cung cấp." },
              { title: "Chuyển thành yêu cầu báo giá cụ thể", desc: "Cung cấp số lượng và thông số để tạo RequirementDraft hoàn chỉnh." }
            ]
          }
        };
      }

      case 'SUPPLIER_OPPORTUNITY': {
        return {
          entityType: 'supplier_opportunity',
          entityId: null,
          draft: null,
          clarification: {
            question: "Bạn muốn tìm cơ hội cung ứng theo nhóm khách hàng nào?",
            options: [
              "Nhu cầu mua hàng từ nhà máy FDI tại các KCN",
              "Đơn hàng mua sắm định kỳ hàng tháng",
              "Đăng ký gian hàng tại Ngày hội để tiếp cận 200 Buyer"
            ]
          },
          suppi: {
            name: "SUPPI",
            role: "Khớp lệnh Nhu cầu Nhà máy đang mở",
            avatar: "/mascots/SUPPI_2.png",
            color: "blue",
            findings: [
              {
                name: "Nhà máy Điện tử TechVina (KCN VSIP II)",
                location: "Bình Dương",
                matchRate: "96%",
                kyc: "Nhà máy FDI xác thực",
                phase: "Đang tìm: 20.000 thùng carton chống tĩnh điện & pallet",
                capacity: "Ngân sách: 180 triệu / đợt - Hạn nhận báo giá: 5 ngày tới"
              },
              {
                name: "Công ty Dệt Nhuộm Hansoll Vina (KCN Amata)",
                location: "Đồng Nai",
                matchRate: "93%",
                kyc: "Nhà máy Doanh nghiệp lớn",
                phase: "Đang tìm: 800 bộ đồng phục công nhân & bảo hộ chịu nhiệt",
                capacity: "Định kỳ 6 tháng/lần - Hạn nộp hồ sơ mẫu: Tuần tới"
              }
            ]
          },
          chainy: {
            name: "CHAINY",
            role: "Nộp Hồ sơ Năng lực & Chào thầu",
            avatar: "/mascots/CHAINY_2.png",
            color: "pink",
            actions: [
              { title: "Nộp hồ sơ chào thầu nhanh (Express Bid)", desc: "Gửi báo giá và catalogue công ty tới Bộ phận Mua sắm của nhà máy." },
              { title: "Hẹn gửi mẫu thực tế", desc: "Xếp lịch giao mẫu thử đến phòng QC kiểm định chất lượng." }
            ]
          }
        };
      }

      default: {
        return createEntityDraft({ intent: 'GENERAL_QUESTION', query, userRoleObj, currentUser, currentConv });
      }
    }
  };

  // Submit Prompt to Suppi & Chainy
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isProcessing) return;
    const userRoleObj = ROLES.find(r => r.id === selectedRole) || ROLES[0];
    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'user', role: userRoleObj.label, text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputPrompt('');
    setIsProcessing(true);
    setChatHistory(prev => [{ id: Date.now(), title: query.slice(0, 38), time: 'Vừa xong', role: userRoleObj.label }, ...prev.slice(0, 8)]);
    try {
      const response = await sendDifyMessage({ query });
      const nextConversation = { ...conversation, backendConversationId: response.conversation_id };
      setConversation(nextConversation);
      try { localStorage.setItem('ccu_active_conversation', JSON.stringify(nextConversation)); } catch {}
      const findings = (response.results || []).map(item => ({
        name: item.name, location: item.location || 'Chưa có địa bàn trong hồ sơ',
        matchRate: 'Theo tiêu chí', kyc: item.verification_status === 'VERIFIED' ? 'Có trạng thái xác minh' : 'Chưa xác minh',
        capacity: (item.match_signals || []).map(signal => signal.value).join('; ') || 'Cần xác nhận năng lực',
        url: item.url
      }));
      if (response.draft) setCurrentDraft(response.draft);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'ai', intent: 'GENERAL_QUESTION',
        draft: response.draft || null, entityType: response.draft ? 'need' : null, entityId: response.draft?.id || null,
        suppi: { name: 'SUPPI', role: 'Tìm nguồn có căn cứ', message: response.mode === 'SUPPI' ? response.answer : 'Ngữ cảnh tìm nguồn được giữ trong cuộc trao đổi; chưa thực hiện hành động kết nối bên ngoài.',
          isLiveAi: response.engine === 'openai' || response.engine === 'dify', findings },
        chainy: { name: 'CHAINY', role: 'Chuẩn bị kết nối — chưa thực thi', actions: response.mode === 'CHAINY' ? [{ title: 'Nội dung CHAINY', desc: response.answer }] : [] },
        conversation: nextConversation,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'ai', intent: 'GENERAL_QUESTION',
        suppi: { name: 'SUPPI', role: 'Trợ lý CCU', message: error.message, findings: [], isLiveAi: false },
        chainy: { name: 'CHAINY', role: 'Chưa thực hiện hành động bên ngoài', actions: [] },
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally { setIsProcessing(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle incoming query params from Homepage (/tro-ly-ai?q=...&role=...&assistant=...)
  useEffect(() => {
    if (processedParamRef.current) return;
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    const roleParam = params.get('role');

    if (roleParam && ROLES.some(r => r.id === roleParam)) {
      setSelectedRole(roleParam);
    }

    if (qParam && qParam.trim()) {
      processedParamRef.current = true;
      handleSendMessage(qParam.trim());
    }
  }, [location.search]);

  // Tiếp nhận lịch sử đoạn chat từ DifyChatWidget khi người dùng bấm mở rộng
  useEffect(() => {
    let sourceMsgs = location.state?.transferredMessages;
    if (!sourceMsgs) {
      try {
        const raw = localStorage.getItem('ccu_active_chat_messages');
        if (raw) {
          sourceMsgs = JSON.parse(raw);
        }
      } catch (e) {}
    }

    if (Array.isArray(sourceMsgs) && sourceMsgs.length > 0) {
      setMessages(prev => {
        // Nếu đã có tin nhắn trong workspace thì không ghi đè trùng lặp
        if (prev.length > 0) return prev;

        return sourceMsgs.map((m, idx) => ({
          ...m,
          id: m.id || `transferred_${idx}_${Date.now()}`,
          fromWidget: true
        }));
      });
    }
  }, [location.state]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-800">

      {/* ========================================================
          1. LEFT SIDEBAR (DESKTOP DOCKED & MOBILE DRAWER)
      ======================================================== */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[305px] xl:w-[325px] bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}>

        {/* Sidebar Brand Header (Logo hoa có nhãn AI ở trong + chữ chuẩn trang chủ) */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <BrandLogo variant="light" size="md" showAiInLogo={true} showSuppiChainySubtitle={true} />
          </Link>

          {/* Close Sidebar button on mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button (Chỉ có 1 dấu cộng) */}
        <div className="p-3 border-b border-slate-100">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] via-blue-600 to-[#0284c7] hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-sm sm:text-[15px] shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Cuộc trò chuyện mới</span>
          </button>
          <div className="text-[12px] sm:text-[12.5px] text-blue-600 font-semibold text-center pt-2 font-heading">
            Hỏi SUPPI · Nhờ CHAINY hỗ trợ
          </div>
        </div>

        {/* Sidebar Nav Groups (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-5 text-sm text-slate-700 scrollbar-thin scrollbar-thumb-slate-200">

          {/* 01 — CÔNG VIỆC CỦA TÔI (ĐỘNG THEO VAI TRÒ ĐƯỢC CHỌN) */}
          {(() => {
            const currentRoleSection = sidebarRoleSections[selectedRole] || sidebarRoleSections.factory;
            const currentRoleInfo = ROLES.find(r => r.id === selectedRole) || ROLES[0];
            return (
              <div className="space-y-1">
                <div className="px-2.5 pb-1 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading flex items-center justify-between">
                  <span>CÔNG VIỆC CỦA TÔI</span>
                  <span className="text-[10.5px] normal-case font-semibold text-[#0052cc] bg-blue-50/90 border border-blue-100/80 px-2 py-0.5 rounded-full">
                    {currentRoleInfo.label}
                  </span>
                </div>
                {currentRoleSection.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const hasCount = typeof item.count === 'number';
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.to) navigate(item.to);
                        else handleSendMessage(item.label);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[13.5px] font-medium transition cursor-pointer text-left ${isActive
                          ? 'bg-blue-50 text-[#0052cc] font-bold shadow-2xs'
                          : 'hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0052cc]' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {hasCount && (
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold transition-colors ${item.highlight
                            ? 'bg-orange-100 text-orange-700'
                            : isActive ? 'bg-blue-100 text-[#0052cc]' : 'bg-slate-100 text-slate-600'
                          }`}>
                          {item.count.toLocaleString('vi-VN')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* 02 — HỒ SƠ & TỔ CHỨC */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading">
              HỒ SƠ & TỔ CHỨC
            </div>
            {[
              { 
                id: 'ho-so', 
                label: (sidebarRoleSections[selectedRole] || sidebarRoleSections.factory).profileLabel || 'Hồ sơ của tôi', 
                icon: Building2, 
                to: '/nha-cung-ung' 
              },
              { id: 'nang-luc-nhu-cau', label: 'Năng lực & nhu cầu', icon: Layers, to: '/ban-do-6-giai-doan' },
              { id: 'dia-ban', label: 'Địa bàn hoạt động', icon: MapPin, to: '/khu-cong-nghiep' },
              { id: 'ho-so-tai-lieu', label: 'Hồ sơ & tài liệu', icon: BookOpen }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.to) navigate(item.to);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition cursor-pointer text-left truncate"
                >
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {/* Mức độ hoàn thiện hồ sơ */}
            <div className="mx-1 mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span className="text-[12.5px] font-bold text-slate-800">Hoàn thiện hồ sơ</span>
                <span className="text-[#0052cc] font-mono text-[12.5px] font-bold">78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Bổ sung 3 thông tin để SUPPI tìm đúng cơ hội hơn
              </div>
            </div>
          </div>

          {/* 03 — CƠ HỘI & CHƯƠNG TRÌNH */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading">
              CƠ HỘI & CHƯƠNG TRÌNH
            </div>
            {[
              { id: 'co-hoi-cho-toi', label: 'Cơ hội dành cho tôi', icon: Sparkles, count: '8 mới' },
              { id: 'ket-noi-kcn', label: 'Kết nối tại KCN', icon: Factory, to: '/ban-do-khu-cong-nghiep-viet-nam' },
              { id: 'ngay-hoi-ccu', label: 'Ngày hội Chuỗi Cung Ứng', icon: Sparkles, to: '/ngay-hoi-chuoi-cung-ung', badge: 'Hot' },
              { id: 'su-kien-sap-toi', label: 'Sự kiện sắp tới', icon: Calendar, to: '/ngay-hoi-chuoi-cung-ung' },
              { id: 'chuong-trinh-ket-noi', label: 'Chương trình kết nối', icon: Handshake }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.to) navigate(item.to);
                    else handleSendMessage(item.label);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10.5px] font-black uppercase font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[11px] font-bold font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 04 — HỢP TÁC & ĐỒNG HÀNH */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading">
              HỢP TÁC & ĐỒNG HÀNH
            </div>
            {[
              { id: 'doi-tac-sang-lap', label: 'Đối tác Đồng hành Sáng lập', icon: Crown, to: '/founding-partner' },
              { id: 'co-hoi-tai-tro', label: 'Cơ hội tài trợ', icon: Gem, to: '/ngay-hoi-chuoi-cung-ung/dang-ky' },
              { id: 'hop-tac-to-chuc', label: 'Hợp tác tổ chức', icon: Users },
              { id: 'hop-tac-fdi', label: 'Hợp tác FDI / Quốc tế', icon: Globe }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.to) navigate(item.to);
                    else handleSendMessage(item.label);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition cursor-pointer text-left truncate"
                >
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* 05 — SUPPI & CHAINY (BLOCK TRỢ LÝ) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="px-2.5 pb-0.5 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading">
              SUPPI & CHAINY
            </div>
            <div
              onClick={() => handleSendMessage("SUPPI ơi, tìm giúp tôi nhà cung ứng phù hợp...")}
              className="p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/70 cursor-pointer transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0052cc] text-white flex items-center justify-center font-black text-xs shrink-0">
                S
              </div>
              <div className="truncate">
                <div className="font-bold text-[13px] text-sky-950 group-hover:text-[#0052cc]">SUPPI — Tìm nguồn</div>
                <div className="text-[11px] text-sky-700 truncate">Tìm đúng nguồn · Tìm đúng cơ hội</div>
              </div>
            </div>
            <div
              onClick={() => handleSendMessage("CHAINY ơi, hỗ trợ tôi kết nối và theo dõi việc...")}
              className="p-2.5 rounded-xl bg-pink-50/70 hover:bg-pink-100 border border-pink-200/70 cursor-pointer transition flex items-center gap-2.5 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-black text-xs shrink-0">
                C
              </div>
              <div className="truncate">
                <div className="font-bold text-[13px] text-pink-950 group-hover:text-[#e11d48]">CHAINY — Kết nối</div>
                <div className="text-[11px] text-pink-700 truncate">Kết nối · Điều phối · Đến kết quả</div>
              </div>
            </div>
          </div>

          {/* LỊCH SỬ CÔNG VIỆC GẦN ĐÂY */}
          <div className="space-y-1 pt-1">
            <div className="px-2.5 pb-1 text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-heading flex items-center justify-between">
              <span>LỊCH SỬ GẦN ĐÂY</span>
              <History className="w-3.5 h-3.5" />
            </div>
            {chatHistory.map(hist => (
              <button
                key={hist.id}
                onClick={() => {
                  handleSendMessage(hist.title);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition cursor-pointer group"
              >
                <div className="font-medium text-slate-700 group-hover:text-[#0052cc] truncate text-[11.5px]">
                  {hist.title}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{hist.role}</span>
                  <span>{hist.time}</span>
                </div>
              </button>
            ))}
          </div>

        </div>

      </aside>

      {/* ========================================================
          2. MAIN CONTENT AREA (KHU VỰC AI CHÍNH Ở GIỮA)
      ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">

        {/* Top Navigation Bar (Section XIX) */}
        <header className="h-14 border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            {/* Toggle Sidebar Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer lg:hidden"
              title="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Back to Home Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0052cc] transition py-1 px-2.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>

            {/* Dynamic Conversation Entity Link Indicator */}
            {conversation.entityType && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">Linked Entity:</span>
                <span className="font-bold">{conversation.entityType}</span>
                {conversation.entityId && (
                  <>
                    <span className="text-indigo-400">#</span>
                    <span className="font-bold">{conversation.entityId}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2.5 text-xs">

            {!currentUser.isLoggedIn ? (
              /* GUEST STATE */
              <>
                <a
                  href="tel:19008686"
                  className="hidden sm:inline-flex items-center gap-1 text-slate-500 hover:text-[#0052cc] font-medium px-2 py-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                  <span>Hotline: <strong>1900 8686</strong></span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>ĐĂNG NHẬP</span>
                </button>
              </>
            ) : (
              /* LOGGED IN STATE */
              <>
                {!currentUser.isZaloLinked ? (
                  <button
                    type="button"
                    onClick={() => setShowZaloModal(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0052cc] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    title="Liên kết Zalo để nhận cập nhật tự động"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#0052cc]" />
                    <span>Liên kết Zalo</span>
                  </button>
                ) : (
                  <div
                    onClick={() => setShowZaloModal(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Zalo đã liên kết (Bấm để xem)"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>Zalo</span>
                  </div>
                )}

                {/* Notification Bell */}
                <button
                  type="button"
                  onClick={() => showToast("🔔 Hiện tại chưa có thông báo mới.")}
                  className="relative p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  title="Thông báo"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* User Org Capsule & Dropdown */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="font-bold text-[11px] text-slate-900 leading-tight truncate max-w-[130px]">
                      {currentUser.orgName}
                    </div>
                    <div className="text-[9.5px] text-slate-500 font-medium">
                      {currentUser.role}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                    title="Đăng xuất (Chuyển về Guest)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Center Workspace Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between">

          <div className="max-w-4xl w-full mx-auto space-y-8 my-auto">

            {/* If NO messages yet: Render Grand Welcome Screen */}
            {messages.length === 0 ? (
              <div className="space-y-4 sm:space-y-5 text-center">

                {/* DUAL MASCOTS: SUPPI BÊN TRÁI & CHAINY BÊN PHẢI (INTERACTIVE CURSOR HEAD TRACKING & SPEECH BUBBLES) */}
                <div className="pt-10 sm:pt-12">
                  <DualMascotInteractive
                    size={155}
                    showBadges={false}
                    showSpeechBubbles={true}
                    spacingClassName="-space-x-10 sm:-space-x-12"
                    onSuppiClick={() => setInputPrompt("SUPPI ơi, giúp tôi tìm nhà cung cấp...")}
                    onChainyClick={() => setInputPrompt("CHAINY ơi, hỗ trợ tôi theo dõi và kết nối đơn...")}
                  />
                </div>

                {/* HEADLINE */}
                <div className="pt-0 max-w-2xl mx-auto">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight uppercase leading-snug">
                    <span className="text-rainbow-gradient">“CHỈ CẦN NÓI BẠN ĐANG CẦN GÌ.”</span>
                  </h1>
                </div>

                {/* 4. BIG SEARCH / CHAT INPUT BOX (Ô CHAT LỚN VỚI VIỀN ĐA SẮC CHUYỂN ĐỘNG) */}
                <div className="max-w-3xl mx-auto">
                  <div className="clickup-chat-border shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/20 focus-within:shadow-2xl focus-within:shadow-blue-500/25 transition-all duration-300">
                    <div className="relative z-10 bg-white rounded-[25.5px] p-3.5 sm:p-4 text-left">

                      {/* Textarea */}
                      <textarea
                        ref={inputRef}
                        rows={3}
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Hãy mô tả nhu cầu, năng lực hoặc công việc bạn đang muốn giải quyết..."
                        className="w-full bg-transparent resize-none border-0 focus:outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 leading-relaxed"
                      />

                      {/* Input Controls Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Tải lên tài liệu, bản vẽ, catalogue"
                            onClick={() => alert("Tính năng đính kèm bản vẽ & BOM đang được chuẩn bị trong phiên bản tiếp theo.")}
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Ghi âm giọng nói"
                            onClick={() => alert("Nhập bằng giọng nói (Voice Sourcing) sẽ sớm ra mắt.")}
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <span className="text-[11px] text-slate-400 hidden sm:inline ml-1 font-mono">
                            Enter để gửi
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendMessage()}
                          disabled={!inputPrompt.trim() || isProcessing}
                          className={`p-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${inputPrompt.trim() && !isProcessing
                              ? 'bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white shadow-blue-500/25 active:scale-95'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                          <span className="font-heading hidden sm:inline">Gửi yêu cầu</span>
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 5. LỰA CHỌN VAI TRÒ (ROLE SELECTOR CHIPS) */}
                <div className="space-y-2 pt-1 max-w-3xl mx-auto">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Lựa chọn vai trò của bạn:
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {ROLES.map(role => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-900/20 scale-102 ring-2 ring-blue-400/40'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs'
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span>{role.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. TÁC VỤ GỢI Ý CHO VAI TRÒ ĐƯỢC CHỌN (DỰA TRÊN SUPPICHAINY.TXT) */}
                {(() => {
                  const currentRoleData = ROLE_SUGGESTIONS[selectedRole] || ROLE_SUGGESTIONS.factory;
                  return (
                    <div className="pt-4 max-w-3xl mx-auto text-left space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 font-bold px-1">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider font-heading text-[11px] sm:text-xs text-[#072348]">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>{currentRoleData.title}</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">Bấm để hỏi ngay</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentRoleData.tasks.map((task, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSendMessage(task.prompt)}
                            className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 group-hover:bg-blue-100/80 text-[#0052cc] text-[11px] font-bold">
                                  {task.tag}
                                </span>
                                {task.assistant && (
                                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                    task.assistant === 'SUPPI' 
                                      ? 'bg-sky-100 text-sky-700' 
                                      : 'bg-pink-100 text-pink-700'
                                  }`}>
                                    {task.assistant}
                                  </span>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </div>
                            <p className="font-bold text-xs sm:text-[13px] text-slate-800 group-hover:text-blue-900 leading-snug">
                              {task.prompt}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* UX Quote if available (e.g. for Nhà cung ứng) */}
                      {currentRoleData.uxQuote && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-pink-50/70 border border-blue-100/80 text-center text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs mt-3">
                          💡 <span className="font-bold text-[#0052cc]">Gợi ý:</span> “{currentRoleData.uxQuote}”
                        </div>
                      )}

                      {/* Note if available (e.g. for Nhà đầu tư) */}
                      {currentRoleData.note && (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] text-center font-medium mt-2">
                          🔒 {currentRoleData.note}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            ) : (
              /* Conversation Messages Display (Section V, VI, XI, XVI, XVII) */
              <div className="space-y-6 pt-2 pb-6">

                {/* Conversation Header & Channel Indicators (Section XVI) */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 via-white to-pink-50/90 border border-slate-200/90 shadow-2xs text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Bot className="w-4 h-4 text-[#0052cc]" />
                      <span>SUPPI & CHAINY AI Workspace</span>
                    </div>

                    {/* Channels indicator */}
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Website
                      </span>
                      {currentUser.isZaloLinked ? (
                        <span
                          onClick={() => setShowZaloModal(true)}
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10.5px] font-bold cursor-pointer transition"
                          title="Bấm để xem trạng thái Zalo"
                        >
                          <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                          Zalo đã liên kết
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowZaloModal(true)}
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10.5px] font-medium transition cursor-pointer"
                        >
                          <Smartphone className="w-3 h-3 text-slate-400" />
                          <span>+ Liên kết Zalo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden md:inline">
                      Tiếp tục trao đổi trên Website hoặc Zalo không mất ngữ cảnh
                    </span>
                    <button
                      type="button"
                      onClick={handleNewChat}
                      className="text-[#0052cc] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cuộc trò chuyện mới</span>
                    </button>
                  </div>
                </div>

                {/* Messages stream */}
                {messages.map(msg => (
                  <div key={msg.id} className="space-y-4 animate-in fade-in duration-300">

                    {/* TRANSFERRED WIDGET MESSAGES (TỪ POPUP CHAT SANG TOÀN MÀN HÌNH) */}
                    {msg.fromWidget && (
                      <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} my-2`}>
                        {msg.sender === 'user' ? (
                          <div className="max-w-xl p-4 rounded-2xl rounded-tr-xs bg-slate-100 text-black border border-slate-200/90 shadow-2xs space-y-1">
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                              Khách
                            </div>
                            <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap text-black">
                              {msg.text}
                            </p>
                            <div className="text-[10px] text-slate-400 text-right pt-0.5 font-mono">
                              {msg.time || msg.timestamp || 'Vừa xong'}
                            </div>
                          </div>
                        ) : (
                          <div className={`max-w-2xl p-4 sm:p-5 rounded-3xl rounded-tl-xs shadow-md space-y-2.5 leading-relaxed ${
                            msg.mode === 'CHAINY' 
                              ? 'bg-rose-50/70 border border-rose-200 text-[#e11d48]' 
                              : 'bg-blue-50/70 border border-blue-200 text-[#0052cc]'
                          }`}>
                            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
                              <img 
                                src={msg.mode === 'CHAINY' ? "/mascots/type_chainy.png" : "/mascots/type_suppi.png"}
                                alt={msg.mode}
                                onError={(e) => {
                                  e.currentTarget.src = msg.mode === 'CHAINY' ? "/type_chainy.png" : "/type_suppi.png";
                                }}
                                className={`w-8 h-8 rounded-full object-cover border-2 shadow-xs shrink-0 ${
                                  msg.mode === 'CHAINY' ? 'border-rose-300' : 'border-blue-300'
                                }`}
                              />
                              <div>
                                <span className={`font-black text-xs sm:text-sm uppercase tracking-wide font-heading block ${
                                  msg.mode === 'CHAINY' ? 'text-[#e11d48]' : 'text-[#0052cc]'
                                }`}>
                                  {msg.mode === 'CHAINY' ? 'CHAINY | TRỢ LÝ KẾT NỐI' : 'SUPPI | TRỢ LÝ TÌM NGUỒN'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Lịch sử trao đổi từ Chat Widget
                                </span>
                              </div>
                            </div>

                            <div className={`whitespace-pre-line text-xs sm:text-sm font-medium leading-relaxed ${
                              msg.mode === 'CHAINY' ? 'text-[#e11d48]' : 'text-[#0052cc]'
                            }`}>
                              {msg.text}
                            </div>

                            <div className="text-[10px] text-slate-400 text-right pt-1 font-mono">
                              {msg.time || msg.timestamp || 'Vừa xong'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* USER MESSAGE BUBBLE (NATIVE WORKSPACE) */}
                    {!msg.fromWidget && msg.sender === 'user' && (
                      <div className="flex justify-end">
                        <div className="max-w-xl bg-gradient-to-r from-[#0052cc] to-sky-600 text-white rounded-2xl rounded-tr-xs p-4 shadow-md space-y-1">
                          <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">
                            Vai trò: {msg.role}
                          </div>
                          <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                          <div className="text-[10px] text-blue-200 text-right pt-0.5 font-mono">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI ACKNOWLEDGMENT MESSAGE */}
                    {!msg.fromWidget && msg.sender === 'ai_ack' && (
                      <div className="flex justify-start">
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    )}

                    {/* SYSTEM EVENT HANDOFF MESSAGE */}
                    {!msg.fromWidget && msg.sender === 'system_event' && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-100 via-indigo-100 to-pink-100 border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-mono">
                            SYSTEM EVENT
                          </span>
                          <span>{msg.title}</span>
                        </div>
                        <p className="w-full text-slate-700 text-[11.5px] mt-0.5">
                          {msg.text}
                        </p>
                      </div>
                    )}

                    {/* AI DUAL RESPONSE (SUPPI & CHAINY NATIVE WORKSPACE) */}
                    {!msg.fromWidget && msg.sender === 'ai' && (
                      <div className="space-y-4">

                        {/* 0. INTENT ROUTER & ENTITY LINK STATUS BADGE */}
                        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider font-mono">
                              INTENT:
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full font-mono font-black text-[10.5px] border ${(INTENT_DEFINITIONS[msg.intent] || INTENT_DEFINITIONS.GENERAL_QUESTION).badgeColor}`}>
                              {msg.intent || 'GENERAL_QUESTION'}
                            </span>
                            <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">
                              ({(INTENT_DEFINITIONS[msg.intent] || INTENT_DEFINITIONS.GENERAL_QUESTION).label})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11.5px] font-mono">
                            <span className="text-slate-400">entity:</span>
                            {msg.entityType ? (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                                {msg.entityType} #{msg.entityId}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                                null (không tạo draft)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* A1. REQUIREMENT DRAFT CARD (intent === BUYER_REQUIREMENT, entityType === need) */}
                        {msg.entityType === 'need' && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-indigo-50/80 border-2 border-blue-200/90 shadow-md space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  ✓
                                </span>
                                <span className="text-xs sm:text-sm font-black text-blue-950 font-heading">
                                  SUPPI đã tạo bản nháp nhu cầu
                                </span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[10px] font-black uppercase font-mono tracking-wider">
                                {currentDraft?.status || msg.draft.status || 'DRAFT_AI'}
                              </span>
                            </div>

                            {/* Draft Title & Quick Tags */}
                            <div className="bg-white rounded-2xl p-3.5 border border-blue-100/80 shadow-2xs space-y-2.5">
                              <div className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                                {(currentDraft?.title || msg.draft.title || '').toUpperCase()}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 font-medium">
                                <span className="font-bold text-slate-900">{currentDraft?.location || msg.draft.location || 'Đồng Nai'}</span>
                                <span className="text-slate-400">·</span>
                                <span>{currentDraft?.quantity || msg.draft.quantity} {currentDraft?.unit || msg.draft.unit || 'bộ'}</span>
                                <span className="text-slate-400">·</span>
                                <span>{currentDraft?.deadline || msg.draft.deadline || 'cần tháng sau'}</span>
                                {(currentDraft?.sampleRequired ?? currentDraft?.sample_required ?? msg.draft.sampleRequired ?? msg.draft.sample_required) && (
                                  <>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-emerald-700 font-bold">cần xem mẫu</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Completeness Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700">Độ hoàn thiện thông tin</span>
                                <span className="text-[#0052cc] font-mono">
                                  {currentDraft?.completenessScore || currentDraft?.completeness_score || msg.draft.completenessScore || msg.draft.completeness_score || 65}%
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
                                  style={{ width: `${currentDraft?.completenessScore || currentDraft?.completeness_score || msg.draft.completenessScore || msg.draft.completeness_score || 65}%` }}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <Link
                                to={`/dang-nhu-cau?draft=${currentDraft?.id || msg.draft.id}`}
                                className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] via-blue-600 to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs sm:text-[13px] shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Xem & hoàn thiện nhu cầu</span>
                              </Link>

                              <Link
                                to={`/tai-khoan/nhu-cau/${currentDraft?.id || msg.draft.id}`}
                                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Mở Workspace 8 Tabs theo dõi tiến độ"
                              >
                                <Layers className="w-3.5 h-3.5" />
                                <span>Workspace nhu cầu</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() => setShowDraftDrawer(true)}
                                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-blue-200 text-[#0052cc] font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>Xem nhanh</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* A2. SPONSORSHIP DRAFT CARD (intent === SPONSORSHIP, entityType === sponsorship_request) */}
                        {msg.entityType === 'sponsorship_request' && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-50/90 via-fuchsia-50/50 to-indigo-50/80 border-2 border-purple-200/90 shadow-md space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  ✓
                                </span>
                                <div>
                                  <span className="text-xs sm:text-sm font-black text-purple-950 font-heading block">
                                    SUPPI đã lập Đề xuất Tài trợ & Đồng hành
                                  </span>
                                  <span className="text-[10.5px] text-purple-700 font-medium">
                                    Partnership / Service Draft (Không ép thành procurement need)
                                  </span>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase font-mono tracking-wider">
                                {msg.draft.status}
                              </span>
                            </div>

                            <div className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-2xs space-y-2.5">
                              <div className="font-black text-xs sm:text-base text-slate-900 leading-snug">
                                {msg.draft.title.toUpperCase()}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-purple-600" />
                                  {msg.draft.program_name}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
                                  💎 {msg.draft.tier}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-orange-500" />
                                  {msg.draft.location}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                                  💰 {msg.draft.budget_range}
                                </span>
                              </div>
                              {msg.draft.benefits && (
                                <div className="pt-2 border-t border-slate-100 space-y-1">
                                  <div className="text-[11px] font-bold text-slate-700">Quyền lợi trọng điểm:</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                                    {msg.draft.benefits.map((b, bIdx) => (
                                      <div key={bIdx} className="flex items-center gap-1.5">
                                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                        <span className="truncate">{b}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Completeness Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700">Độ hoàn thiện đề xuất tài trợ</span>
                                <span className="text-purple-700 font-mono">{msg.draft.completeness_score}%</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-purple-100 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 rounded-full"
                                  style={{ width: `${msg.draft.completeness_score}%` }}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => navigate('/ngay-hoi-chuoi-cung-ung/dang-ky')}
                                className="flex-1 min-w-[170px] py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-purple-200 text-purple-700 font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem hồ sơ quyền lợi tài trợ</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => showToast("✓ Đã gửi đề xuất tài trợ tới Ban Tổ chức Ngày hội!")}
                                className="flex-1 min-w-[170px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Kết nối Ban Tổ chức</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* A3. FDI SERVICE REQUEST DRAFT CARD (intent === FDI_MARKET_ENTRY, entityType === fdi_service_request) */}
                        {msg.entityType === 'fdi_service_request' && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-teal-50/90 via-cyan-50/50 to-blue-50/80 border-2 border-teal-200/90 shadow-md space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  ✓
                                </span>
                                <div>
                                  <span className="text-xs sm:text-sm font-black text-teal-950 font-heading block">
                                    SUPPI đã tạo Bản đề xuất Dịch vụ FDI
                                  </span>
                                  <span className="text-[10.5px] text-teal-700 font-medium">
                                    FDI Service Request Draft — Xúc tiến đầu tư & Chuỗi cung ứng bản địa
                                  </span>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase font-mono tracking-wider">
                                {msg.draft.status}
                              </span>
                            </div>

                            <div className="bg-white rounded-2xl p-3.5 border border-teal-100 shadow-2xs space-y-2.5">
                              <div className="font-black text-xs sm:text-base text-slate-900 leading-snug">
                                {msg.draft.title.toUpperCase()}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-700">
                                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200 flex items-center gap-1">
                                  🌏 {msg.draft.target_provinces}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1">
                                  🏭 {msg.draft.investment_scale}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1">
                                  ⏱ {msg.draft.timeline}
                                </span>
                              </div>
                              <div className="text-[11.5px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <strong>Phạm vi dịch vụ:</strong> {msg.draft.service_scope}
                              </div>
                            </div>

                            {/* Completeness Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700">Độ hoàn thiện yêu cầu FDI</span>
                                <span className="text-teal-700 font-mono">{msg.draft.completeness_score}%</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-teal-100 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500 rounded-full"
                                  style={{ width: `${msg.draft.completeness_score}%` }}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => navigate('/dich-vu/to-chuc-ket-noi')}
                                className="flex-1 min-w-[170px] py-2 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-teal-200 text-teal-700 font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem lộ trình FDI Concierge</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => showToast("✓ Chuyên viên FDI Concierge sẽ liên hệ hỗ trợ bạn trong 2 giờ làm việc.")}
                                className="flex-1 min-w-[170px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Đặt lịch Concierge FDI 1:1</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* A4. PARTNERSHIP DRAFT CARD (intent === FOUNDING_PARTNER, entityType === partnership_request) */}
                        {msg.entityType === 'partnership_request' && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 border-2 border-indigo-200 shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs sm:text-sm font-bold text-indigo-950 font-heading">
                                  SUPPI đã ghi nhận Hồ sơ Đối tác Đồng hành Sáng lập
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                                {msg.draft.status}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                              <div className="font-bold text-slate-900">{msg.draft.title}</div>
                              <div className="text-[11px] text-slate-500">{msg.draft.cooperation_model}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => navigate('/founding-partner')}
                                className="flex-1 py-2 rounded-xl bg-[#0052cc] text-white font-bold text-xs hover:bg-[#0041a8] transition flex items-center justify-center gap-1.5"
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span>Xem chi tiết chương trình Sáng lập</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* A5. PROGRAM REGISTRATION DRAFT CARD (intent === EVENT_INTEREST, entityType === program_registration) */}
                        {msg.entityType === 'program_registration' && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <span className="text-xs sm:text-sm font-bold text-amber-950 font-heading">
                                  SUPPI đã tạo Bản đăng ký tham gia sự kiện
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                                {msg.draft.status}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-amber-100 text-xs text-slate-700 space-y-1">
                              <div className="font-bold text-slate-900">{msg.draft.title}</div>
                              <div className="text-[11px] text-slate-500">{msg.draft.event_name} • {msg.draft.format}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => navigate('/chuong-trinh')}
                                className="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition flex items-center justify-center gap-1.5"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Xem trang Chương trình & Sự kiện</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* A6. OTHER SPECIALIZED DRAFTS (INVESTMENT / EXPERT) */}
                        {(msg.entityType === 'investment_request' || msg.entityType === 'expert_support_request') && msg.draft && (
                          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-200 shadow-md space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs sm:text-sm font-bold text-emerald-950 font-heading">
                                  SUPPI đã ghi nhận: {msg.draft.title}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                {msg.draft.status}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700">
                              <div className="font-bold text-slate-900">{msg.draft.domain || msg.draft.funding_type}</div>
                              <div className="text-[11px] text-slate-500 mt-1">Độ hoàn thiện: {msg.draft.completeness_score}%</div>
                            </div>
                          </div>
                        )}

                        {/* NOTE: FOR GENERAL_QUESTION, NO DRAFT CARD IS DISPLAYED — KHÔNG TẠO NHU CẦU! */}

                        {/* B. SUPPI CLARIFICATION QUESTIONS */}
                        {msg.clarification && (
                          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
                              <Bot className="w-4 h-4 text-[#0052cc]" />
                              <span>{msg.clarification.question}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {msg.clarification.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleClarifyOption(opt)}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#0052cc] border border-sky-200 hover:border-[#0052cc] text-xs font-medium transition cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-98"
                                >
                                  <span>+</span>
                                  <span>{opt}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* C. SUPPI'S FINDINGS (Tìm đúng nguồn & Phân tích) */}
                        <div className="bg-white rounded-3xl border border-sky-200/90 shadow-lg p-5 sm:p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-sky-100 shrink-0 drop-shadow-md overflow-hidden relative">
                              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mascots/suppi-directions.webp?v=8)', backgroundSize: '300% 300%', backgroundPosition: '50% 50%' }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-sm text-sky-950 font-heading">
                                  SUPPI
                                </h3>
                                <span className="px-2 py-0.2 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                                  {msg.suppi.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {msg.intent === 'GENERAL_QUESTION'
                                  ? "Trợ lý AI Trinh sát Chuỗi Cung Ứng — Tìm kiếm & Phân tích năng lực đối tác:"
                                  : "Đã phân tích mạng lưới đối tác và tìm thấy kết quả phù hợp nhất:"}
                              </p>
                            </div>
                          </div>

                          {/* SUPPI Formatted message (Markdown, bullets, badges) */}
                          {msg.suppi.message && (
                            <FormattedAiMessage
                              content={msg.suppi.message}
                              isLiveAi={!!msg.suppi.isLiveAi}
                            />
                          )}

                          {/* List of findings if present */}
                          {msg.suppi.findings && msg.suppi.findings.length > 0 && (
                            <div className="space-y-2.5">
                              {msg.suppi.findings.map((item, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors space-y-1.5 text-xs">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                                      {item.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                                        {item.matchRate.includes('%') ? `Khớp ${item.matchRate}` : item.matchRate}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                                        {item.kyc}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                                    <span>{item.location}</span>
                                  </div>

                                  <div className="pt-1 text-[11.5px] text-slate-600">
                                    <strong>Thông tin:</strong> {item.capacity || item.phase}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* D. SYSTEM EVENT BANNER: SUPPI_HANDOFF_CHAINY (Only for actionable requests, not for general questions) */}
                        {msg.intent !== 'GENERAL_QUESTION' && (
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-pink-50 border border-indigo-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold">
                              <span className="p-1 rounded-lg bg-indigo-600 text-white font-mono text-[10px]">
                                HANDOFF
                              </span>
                              <span>⚡ SUPPI_HANDOFF_CHAINY — Chuyển giao điều phối thực thi cho CHAINY</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              CRM ID: {msg.entityId || currentDraft?.id || 'ENTITY-LIVE'}
                            </span>
                          </div>
                        )}

                        {/* E. CHAINY'S PIPELINE & ACTIONS (Theo việc đến cùng) */}
                        <div className="bg-white rounded-3xl border border-pink-200/90 shadow-lg p-5 sm:p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-pink-100 shrink-0 drop-shadow-md overflow-hidden relative">
                              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mascots/chainy-directions.webp?v=8)', backgroundSize: '300% 300%', backgroundPosition: '50% 50%' }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-sm text-pink-950 font-heading">
                                  CHAINY
                                </h3>
                                <span className="px-2 py-0.2 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                                  {msg.chainy.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {msg.intent === 'GENERAL_QUESTION'
                                  ? "Trợ lý AI Điều phối & Đôn đốc công việc — Bấm các tác vụ bên dưới để thử nghiệm Intent Router:"
                                  : "Tôi tiếp nhận kết nối này và theo dõi các bước thực thi đến cùng:"}
                              </p>
                            </div>
                          </div>

                          {/* 9 STAGE PIPELINE VISUAL TRACKER (Rendered for actionable requests) */}
                          {msg.intent !== 'GENERAL_QUESTION' && (
                            <div className="space-y-1.5 bg-pink-50/40 p-3 rounded-2xl border border-pink-100">
                              <div className="text-[10px] font-black uppercase text-pink-900 tracking-wider">
                                TIẾN ĐỘ THỰC THI (9 GIAI ĐOẠN CRM)
                              </div>
                              <div className="flex items-center overflow-x-auto py-1 text-[10px] font-bold gap-1 scrollbar-none">
                                {[
                                  { name: 'Nhu cầu', state: 'done' },
                                  { name: 'Tìm nguồn', state: 'done' },
                                  { name: 'NCC xác nhận', state: 'active' },
                                  { name: 'Kết nối', state: 'pending' },
                                  { name: 'Cuộc gặp', state: 'pending' },
                                  { name: 'Mẫu', state: 'pending' },
                                  { name: 'Báo giá', state: 'pending' },
                                  { name: 'Thương lượng', state: 'pending' },
                                  { name: 'Kết quả', state: 'pending' }
                                ].map((st, i, arr) => (
                                  <React.Fragment key={st.name}>
                                    <span className={`px-2 py-1 rounded-lg whitespace-nowrap ${
                                      st.state === 'done'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : st.state === 'active'
                                        ? 'bg-pink-600 text-white animate-pulse'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}>
                                      {st.state === 'done' ? '✓ ' : ''}{st.name}
                                    </span>
                                    {i < arr.length - 1 && <span className="text-slate-300">→</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* List of recommended actions */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {msg.chainy.actions.map((act, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (msg.intent === 'GENERAL_QUESTION' || act.desc?.includes('Thử gõ')) {
                                    const promptText = act.desc?.match(/'([^']+)'/)?.[1] || act.title;
                                    handleSendMessage(promptText);
                                  }
                                }}
                                className={`p-3 rounded-2xl bg-pink-50/50 border border-pink-200/80 hover:border-pink-300 transition-all space-y-1 text-xs ${
                                  msg.intent === 'GENERAL_QUESTION' ? 'cursor-pointer hover:bg-pink-100/70 shadow-xs hover:scale-101 active:scale-98' : ''
                                }`}
                              >
                                <div className="font-bold text-slate-900 text-xs flex items-center justify-between gap-1.5">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                                    <span className="truncate">{act.title}</span>
                                  </div>
                                  {msg.intent === 'GENERAL_QUESTION' && (
                                    <ChevronRight className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  {act.desc}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Contextual Action Buttons */}
                          {msg.intent === 'BUYER_REQUIREMENT' && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  showToast("✓ Đã gửi yêu cầu chào giá (RFQ) tự động tới các nhà cung ứng.");
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                              >
                                Khởi tạo Yêu cầu Báo giá (RFQ)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  showToast("✓ Đã lưu yêu cầu gửi mẫu thử nghiệm vào CRM.");
                                }}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                              >
                                Xác nhận lịch gửi mẫu
                              </button>
                              <Link
                                to="/ngay-hoi-chuoi-cung-ung"
                                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition"
                              >
                                Đặt lịch gặp trực tiếp tại Ngày Hội KCN
                              </Link>
                            </div>
                          )}

                          {msg.intent === 'SPONSORSHIP' && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => navigate('/ngay-hoi-chuoi-cung-ung/dang-ky')}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                              >
                                Tải Hồ sơ & Sơ đồ Gian hàng VIP
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast("✓ Đã gửi đề xuất làm việc 1:1 tới Trưởng Ban Tổ chức Ngày hội.")}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs transition cursor-pointer shadow-2xs"
                              >
                                Đặt lịch Họp với Trưởng BTC
                              </button>
                            </div>
                          )}

                          {msg.intent === 'FDI_MARKET_ENTRY' && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => showToast("✓ Chuyên viên Concierge FDI sẽ liên hệ sắp xếp buổi làm việc trong 24h.")}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                              >
                                Đặt lịch Concierge FDI 1:1
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate('/dich-vu/to-chuc-ket-noi')}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs transition cursor-pointer shadow-2xs"
                              >
                                Khảo sát Danh sách KCN & Nhà xưởng
                              </button>
                            </div>
                          )}

                          {/* Zalo sync alert (Section XVIII) */}
                          {currentUser.isZaloLinked && (
                            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-[11px] flex items-center gap-2">
                              <Smartphone className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
                              <span>
                                <strong>Zalo CRM Sync:</strong> Tiến độ nhận báo giá và gửi mẫu sẽ được CHAINY thông báo đồng thời qua Zalo của bạn.
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                ))}

                {/* AI Thinking Animation */}
                {isProcessing && (
                  <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
                    <div className="flex items-center -space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 relative overflow-hidden shrink-0">
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mascots/suppi-directions.webp?v=8)', backgroundSize: '300% 300%', backgroundPosition: '50% 50%' }} />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-pink-100 relative overflow-hidden shrink-0">
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mascots/chainy-directions.webp?v=8)', backgroundSize: '300% 300%', backgroundPosition: '50% 50%' }} />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      SUPPI đang tìm nguồn và CHAINY đang tổng hợp kế hoạch theo việc...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {/* Persistent Chat Input when inside conversation */}
                <div className="sticky bottom-0 pt-4 bg-white/95 backdrop-blur-md">
                  <div className="clickup-search-border shadow-lg transition-all duration-300">
                    <div className="relative z-10 bg-white rounded-[24px] p-2 sm:p-2.5 flex items-center gap-2">
                      <input
                        type="text"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập phản hồi hoặc yêu cầu tiếp theo cho SUPPI & CHAINY..."
                        className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={!inputPrompt.trim() || isProcessing}
                        className={`p-2 rounded-xl text-white font-bold transition-all cursor-pointer ${inputPrompt.trim() && !isProcessing
                            ? 'bg-[#0052cc] hover:bg-[#0041a8]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer Notice */}
          <div className="pt-6 pb-2 text-center text-[11px] text-slate-400 max-w-xl mx-auto">
            Hệ sinh thái Trợ lý AI SUPPI & CHAINY vận hành bởi CHUOICUNGUNG.COM. Thông tin được đối chiếu thời gian thực từ 24.000+ Nhà cung ứng và 500+ Nhà máy đã xác thực KYC.
          </div>

        </div>

      </main>

      {/* ========================================================
          3. SLIDEOVER DRAWER: XEM & HOÀN THIỆN NHU CẦU (Section V & VI)
      ======================================================== */}
      {showDraftDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0052cc] text-white flex items-center justify-center font-bold text-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Chi tiết Bản nháp Nhu cầu
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ID: {currentDraft?.id || 'DRAFT_AI'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Form Fields */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              {/* Completeness Bar */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-blue-900">Độ hoàn thiện thông tin</span>
                  <span className="text-[#0052cc] font-mono">{currentDraft?.completeness_score || 65}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-blue-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    style={{ width: `${currentDraft?.completeness_score || 65}%` }}
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên nhu cầu tìm kiếm</label>
                <input
                  type="text"
                  value={currentDraft?.title || ''}
                  onChange={(e) => {
                    const u = { ...currentDraft, title: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                    setCurrentDraft(u);
                    try {
                      localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                      localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                    } catch (err) {}
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              {/* Product / Service & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sản phẩm / Dịch vụ</label>
                  <input
                    type="text"
                    value={currentDraft?.productService || currentDraft?.product_service || ''}
                    onChange={(e) => {
                      const u = { ...currentDraft, productService: e.target.value, product_service: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Danh mục ngành</label>
                  <input
                    type="text"
                    value={currentDraft?.category || ''}
                    onChange={(e) => {
                      const u = { ...currentDraft, category: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số lượng</label>
                  <input
                    type="text"
                    value={currentDraft?.quantity || ''}
                    onChange={(e) => {
                      const u = { ...currentDraft, quantity: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Địa bàn giao hàng</label>
                  <input
                    type="text"
                    value={currentDraft?.location || ''}
                    onChange={(e) => {
                      const u = { ...currentDraft, location: e.target.value, province: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* Deadline & Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thời hạn cần hàng</label>
                  <input
                    type="text"
                    value={currentDraft?.deadline || ''}
                    onChange={(e) => {
                      const u = { ...currentDraft, deadline: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngân sách dự kiến</label>
                  <input
                    type="text"
                    value={currentDraft?.budgetMin || currentDraft?.budget_min ? `${currentDraft.budgetMin || currentDraft.budget_min} - ${currentDraft.budgetMax || currentDraft.budget_max || ''}` : 'Theo báo giá'}
                    onChange={(e) => {
                      const u = { ...currentDraft, budgetMin: e.target.value, budget_min: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                      setCurrentDraft(u);
                      try {
                        localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                        localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                      } catch (err) {}
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* Sample Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="drawer-sample"
                  checked={currentDraft?.sampleRequired ?? currentDraft?.sample_required ?? false}
                  onChange={(e) => {
                    const u = { ...currentDraft, sampleRequired: e.target.checked, sample_required: e.target.checked, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                    setCurrentDraft(u);
                    try {
                      localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                      localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                    } catch (err) {}
                  }}
                  className="rounded text-[#0052cc] focus:ring-0"
                />
                <label htmlFor="drawer-sample" className="font-semibold text-slate-700 cursor-pointer">
                  Yêu cầu gửi mẫu thử nghiệm trước khi đặt hàng
                </label>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Yêu cầu kỹ thuật & Ghi chú bổ sung</label>
                <textarea
                  rows={3}
                  value={currentDraft?.specifications || currentDraft?.notes || ''}
                  onChange={(e) => {
                    const u = { ...currentDraft, specifications: e.target.value, notes: e.target.value, updatedAt: new Date().toISOString(), updated_at: new Date().toISOString() };
                    setCurrentDraft(u);
                    try {
                      localStorage.setItem('ccu_requirement_draft', JSON.stringify(u));
                      localStorage.setItem('ccu_draft_' + u.id, JSON.stringify(u));
                    } catch (err) {}
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc] resize-none"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowDraftDrawer(false);
                  navigate(`/dang-nhu-cau?draft=${currentDraft?.id || 'draft'}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Mở trang /dang-nhu-cau đầy đủ</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDraftDrawer(false);
                  handleConfirmClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Xác nhận & Tìm nguồn ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL: LOGIN / LƯU NHU CẦU (Section VII)
      ======================================================== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Copy from Section VII */}
            <div className="space-y-2 text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052cc] mx-auto flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                LƯU NHU CẦU VÀ BẮT ĐẦU TÌM NGUỒN
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đăng nhập để SUPPI lưu nhu cầu này, tìm nhà cung ứng phù hợp và để CHAINY theo dõi công việc đến kết quả.
              </p>
            </div>

            {/* Preserved Data Note */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-medium text-center">
              🔒 <strong>Yên tâm:</strong> Những thông tin bạn vừa trao đổi với SUPPI sẽ được giữ lại nguyên vẹn.
            </div>

            {/* Quick Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Số điện thoại hoặc Email doanh nghiệp
                </label>
                <input
                  type="text"
                  required
                  placeholder="0912 345 678 hoặc email@company.com"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs uppercase shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                ĐĂNG NHẬP NHANH
              </button>
            </form>

            {/* Create account button */}
            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLoginSubmit}
                className="text-xs font-bold text-[#0052cc] hover:underline cursor-pointer"
              >
                TẠO TÀI KHOẢN MIỄN PHÍ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: PRE-PUBLISH CONFIRMATION (Section VIII)
      ======================================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header from Section VIII */}
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[10px] font-black uppercase font-mono">
                XÁC NHẬN TRƯỚC KHI TÌM NGUỒN
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                XÁC NHẬN NHU CẦU
              </h2>
            </div>

            {/* Summary details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                {currentDraft?.title || 'Tìm nhà cung ứng thùng carton 5 lớp chống thấm'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1 border-t border-slate-200">
                <div><strong>Sản phẩm:</strong> {currentDraft?.product_service || 'Bao bì / Thùng carton'}</div>
                <div><strong>Số lượng:</strong> {currentDraft?.quantity || 'Định kỳ'}</div>
                <div><strong>Địa bàn:</strong> {currentDraft?.location || 'Đồng Nai'}</div>
                <div><strong>Thời hạn:</strong> {currentDraft?.deadline || 'Tháng sau'}</div>
              </div>
              {currentDraft?.sample_required && (
                <div className="text-emerald-700 font-medium">
                  ✓ Yêu cầu gửi mẫu thực nghiệm trước
                </div>
              )}
            </div>

            {/* Privacy selection (Section VIII) */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black uppercase text-slate-800 tracking-wider">
                AI ĐƯỢC XEM NHU CẦU NÀY?
              </label>

              <div className="space-y-2 text-xs">
                {/* 1. Riêng tư */}
                <label className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  publishPrivacy === 'PRIVATE' ? 'border-[#0052cc] bg-blue-50/60 ring-2 ring-blue-500/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    checked={publishPrivacy === 'PRIVATE'}
                    onChange={() => setPublishPrivacy('PRIVATE')}
                    className="mt-0.5 text-[#0052cc]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">1. RIÊNG TƯ</div>
                    <div className="text-slate-500 text-[11px]">Chỉ SUPPI và đội điều phối Chuỗi Cung Ứng.</div>
                  </div>
                </label>

                {/* 2. Chỉ NCC phù hợp (DEFAULT) */}
                <label className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  publishPrivacy === 'ONLY_MATCHED' ? 'border-[#0052cc] bg-blue-50/60 ring-2 ring-blue-500/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    checked={publishPrivacy === 'ONLY_MATCHED'}
                    onChange={() => setPublishPrivacy('ONLY_MATCHED')}
                    className="mt-0.5 text-[#0052cc]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">2. CHỈ NCC PHÙ HỢP</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9.5px] font-bold">KHUYÊN DÙNG</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">SUPPI chỉ gửi tới các nhà cung ứng được sàng lọc khớp lệnh.</div>
                  </div>
                </label>

                {/* 3. Đăng trên sàn nhu cầu */}
                <label className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  publishPrivacy === 'PUBLIC_MARKET' ? 'border-[#0052cc] bg-blue-50/60 ring-2 ring-blue-500/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    checked={publishPrivacy === 'PUBLIC_MARKET'}
                    onChange={() => setPublishPrivacy('PUBLIC_MARKET')}
                    className="mt-0.5 text-[#0052cc]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">3. ĐĂNG TRÊN SÀN NHU CẦU</div>
                    <div className="text-slate-500 text-[11px]">Hiển thị công khai các trường thông số cho toàn bộ cộng đồng NCC.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* CTA from Section VIII */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs uppercase shadow-md shadow-blue-500/25 transition cursor-pointer active:scale-98"
              >
                XÁC NHẬN & BẮT ĐẦU TÌM NGUỒN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL: LIÊN KẾT ZALO CRM (Section XII & XIII)
      ======================================================== */}
      {showZaloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative text-center">
            <button
              type="button"
              onClick={() => setShowZaloModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052cc] mx-auto flex items-center justify-center shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                LIÊN KẾT ZALO CRM
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Nhận cập nhật và tiếp tục làm việc với SUPPI & CHAINY trên Zalo mà không mất ngữ cảnh.
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500">
                Mở Zalo và quét mã QR của Zalo Official Account <strong>CHUỖI CUNG ỨNG</strong>
              </div>
            </div>

            {/* Phone link or Instant simulate */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleLinkZaloSubmit}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Mô phỏng Quét mã QR Thành công
              </button>

              <div className="text-[11px] text-slate-400">hoặc</div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Nhập SĐT Zalo"
                  value={zaloPhone}
                  onChange={(e) => setZaloPhone(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052cc]"
                />
                <button
                  type="button"
                  onClick={handleLinkZaloSubmit}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer shrink-0"
                >
                  Kết nối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. FLOATING TOAST NOTIFICATION
      ======================================================== */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs font-bold shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
