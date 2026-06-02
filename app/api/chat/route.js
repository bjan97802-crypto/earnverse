import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { message, system } = await req.json()
    if (!message) return NextResponse.json({ reply: "Message nahi mila." })

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) return NextResponse.json({ reply: "API key .env.local mein nahi hai!" })

    const fullPrompt = system ? `${system}\n\nUser: ${message}` : message

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      }
    )

    const raw = await geminiRes.text()
    let data
    try { data = JSON.parse(raw) } catch { return NextResponse.json({ reply: `Parse error: ${raw.slice(0,200)}` }) }

    if (data.error) return NextResponse.json({ reply: `Gemini Error: ${data.error.message}` })

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || `No reply. Raw: ${JSON.stringify(data).slice(0,200)}`

    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ reply: `Error: ${err.message}` })
  }
}