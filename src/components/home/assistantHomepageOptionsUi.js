export const ASSISTANT_OPTIONS = [
  { id: 'journey', label: 'A · Sân khấu bộ đôi', description: 'Hai mascot chiếm tâm điểm, tên nhân vật khổ lớn và dải công việc nối tìm nguồn với theo việc.' },
  { id: 'desk', label: 'B · Chọn trợ lý', description: 'Chọn trực tiếp trên hình nhân vật. Giao diện đổi theo trợ lý, với lời hướng dẫn ngắn và hành động rõ ràng.' },
  { id: 'editorial', label: 'C · Poster thương hiệu', description: 'Hai trang poster nối tiếp: tên nhân vật lớn, mascot vượt khỏi hàng chữ và một lối bắt đầu cho mỗi vai trò.' },
];
export function resolveAssistantOption(value) {
  return ASSISTANT_OPTIONS.find(option => option.id === value) || ASSISTANT_OPTIONS[0];
}
