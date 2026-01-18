import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { description, languages } = await req.json();

    // 1. შემოწმება, გვაქვს თუ არა API Key
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY missing in .env");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // 2. ვაწყობთ სისტემურ ინსტრუქციას (System Prompt)
    // აქ ვეუბნებით AI-ს, თუ როგორ უნდა მოიქცეს
    const systemInstruction = `
      შენ ხარ უძრავი ქონების გაყიდვების ექსპერტი.
      შენი დავალებაა მომხმარებლის მიერ მოწოდებული მოკლე ინფორმაცია გადააქციო პროფესიონალურ და მიმზიდველ განცხადებად.

      წესები:
      1. დააბრუნე ტექსტი შემდეგ ენებზე: ${languages.join(", ")}.
      2. თითოეული ენა გამოყავი დროშის ემოჯით და სათაურით (მაგ: 🇬🇪 ქართული, 🇬🇧 English, 🇷🇺 Русский).
      3. გამოიყენე აბზაცები, ბულეტები (bullet points) და შესაბამისი ემოჯები, რომ ტექსტი იყოს ადვილად წასაკითხი.
      4. ხაზი გაუსვი ბინის უპირატესობებს (ლოკაცია, ნათელი ოთახები, ხედი და ა.შ.).
      5. პასუხში დააბრუნე მხოლოდ გამზადებული აღწერები, ზედმეტი მისალმების ("აი თქვენი ტექსტი") გარეშე.
    `;

    // 3. მიმართვა Groq API-სთან
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemInstruction
          },
          {
            role: "user",
            content: `გადააკეთე ეს აღწერა: "${description}"`
          }
        ],
        temperature: 0.7, // კრეატიულობის დონე
        max_tokens: 2048
      }),
    });

    const data = await response.json();

    // 4. შეცდომების მართვა
    if (!response.ok) {
      console.error("🔥 Groq API Error:", data);
      return NextResponse.json({ error: data.error?.message || "AI Error" }, { status: response.status });
    }

    // 5. პასუხის დაბრუნება
    const rewrittenText = data.choices[0]?.message?.content;

    if (!rewrittenText) {
      throw new Error("AI-მ პასუხი ვერ დააგენერირა");
    }

    return NextResponse.json({ rewrittenText });

  } catch (error: any) {
    console.error("❌ SERVER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
