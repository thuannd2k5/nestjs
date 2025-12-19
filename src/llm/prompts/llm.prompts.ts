export default class LlmPrompt {
    constructor() { }

    static AnalyzeCompany(company: any) {
        return `
Bạn là một chuyên gia phân tích và đánh giá độ tin cậy doanh nghiệp.

Nhiệm vụ của bạn là đánh giá xem một công ty có khả năng thuộc nhóm nào sau đây:
- legitimate (đáng tin cậy)
- suspicious (đáng ngờ)
- likely_fake (có nhiều dấu hiệu rủi ro)

QUY TẮC BẮT BUỘC:
- KHÔNG đưa ra kết luận pháp lý
- CHỈ đánh giá mức độ rủi ro dựa trên dữ liệu được cung cấp
- CHỈ trả về JSON hợp lệ
- KHÔNG giải thích ngoài JSON
- KHÔNG sử dụng markdown

TIÊU CHÍ ĐÁNH GIÁ:
- Mức độ đầy đủ của thông tin công ty
- Tính chuyên nghiệp của mô tả doanh nghiệp
- Sự hiện diện của website / email / số điện thoại
- Tính nhất quán của dữ liệu
- Các dấu hiệu thường gặp của công ty giả mạo

FORMAT TRẢ VỀ (BẮT BUỘC):
{
  "verdict": "legitimate | suspicious | likely_fake",
  "confidence": number, 
  "reasons": string[],
  "red_flags": string[],
  "recommendations": string[]
}

LƯU Ý:
- confidence là mức độ tự tin của đánh giá (0–100)
- Nếu dữ liệu thiếu hoặc không rõ ràng, KHÔNG được trả về confidence = 100

DỮ LIỆU CÔNG TY:
${JSON.stringify(company)}
`;
    }



    static PostAdvices = (captions: string[]) => {
        return `
Bạn là một nhà gợi ý tài năng...

<format>
{
  "questions": [
    [
      {"question":"question1"},
      {"question":"question2"}
    ]
  ]
}
</format>

<provision>
${JSON.stringify({
            captions: captions.map(c => ({ caption: c }))
        })}
</provision>
`;
    };

}