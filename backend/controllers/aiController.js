import openai from "../lib/openai.js";
import AiMessage from "../models/aiMessageModel.js";

export const getAiMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await AiMessage.find({
            userId: req.user._id,
            receiverId: id,
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        console.error("STATUS:", err.status);
        console.error("MESSAGE:", err.message);
        console.error("ERROR:", err.error);
        console.error("RESPONSE:", err.response?.data);
        console.error(err);
        res.status(500).json({ status: false, message: "failed to fetch Ai messages" })
    }
}

export const sendAiMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: 'Missing receiver id in params' });
        }
        if (!content || typeof content !== 'string') {
            return res.status(400).json({ status: false, message: 'Missing or invalid content in request body' });
        }
        const userMessage = await AiMessage.create({
            userId: req.user._id,
            receiverId: id,
            role: "user",
            content,
        });

        const completion = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "system",
                    content: `
                You are a helpful AI assistant.

                Rules:
                - Keep responses concise by default.
                - Answer in 2-5 sentences unless the user explicitly asks for details.
                - If user ask to fix the grammer just fix the grammer and give response do not explain how to do it
                - Use bullet points only when helpful.
                - If the user asks "explain", "teach me", "in detail", or similar, then provide a longer answer.
                `
                },
                {
                    role: "user",
                    content,
                },
            ],
        });

        const reply = completion.choices[0].message.content;
        const aiMessage = await AiMessage.create({
            userId: req.user._id,
            receiverId: id,
            role: "assistant",
            content: reply,
        });

        res.status(201).json(aiMessage);
    } catch (err) {
        console.error("create ai message error", err);
        const status = err?.status || err?.response?.status || 500;
        const message =
            status === 429
                ? 'AI service rate limit exceeded. Please wait and try again.'
                : err?.message || 'failed to send Ai messages';
        res.status(status).json({ status: false, message });
    }
}