import asyncHandler from 'express-async-handler'

export const handleChatbotRequest = asyncHandler(async (req, res) => {
    // const userMessage = req.body.message;
    // if (!userMessage) {
    //     return res.status(400).json({ error: 'الرسالة غير موجودة.' });
    // }
    // try {
    //     const reply = await handleChatbotRequest(userMessage);
    //     res.json({ reply });
    // } catch (error) {
    //     res.status(500).json({ error: 'فشل في التواصل مع الشات بوت.', details: error.message });
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'الرسالة غير موجودة في الطلب.' });
    }

    try {
        const reply = await handleChatbotRequest(message);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: 'فشل في التواصل مع الشات بوت.', details: error.message });
    }
    });