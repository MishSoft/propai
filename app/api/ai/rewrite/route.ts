import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, languages } = body as { description: string, languages: string[] };

    // 1. ვალიდაცია - აუცილებელია, რომ მონაცემები მოვიდეს
    if (!description || !languages || !Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json({ error: "გთხოვთ მიუთითოთ აღწერა და ენები" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY missing");
      return NextResponse.json({ error: "სერვერის კონფიგურაციის შეცდომა" }, { status: 500 });
    }

    // 2. სისტემური ინსტრუქცია (უფრო კონკრეტული)
    const systemInstruction = `
      შენ ხარ უძრავი ქონების გაყიდვების ექსპერტი.
      დავალება: გადააქციე მოწოდებული ტექსტი პროფესიონალურ განცხადებად.
      ენები: ${languages.join(", ")}.

      ფორმატირება:
      - გამოიყენე აბზაცები და ბულეტები.
      - დაამატე შესაბამისი ემოჯები.
      - თითოეული ენის აღწერა გამოყავი მკაფიოდ სათაურით.
      - დააბრუნე მხოლოდ გამზადებული აღწერები.
      - არავითარი მისალმება ან დამატებითი კომენტარი.
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
          { role: "system", content: systemInstruction },
          { role: "user", content: `ტექსტი დასამუშავებლად: ${description}` }
        ],
        temperature: 0.6, // 0.6 უფრო სტაბილურია პროფესიონალური ტექსტისთვის
        max_tokens: 2048,
        top_p: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "AI API Error" }, { status: response.status });
    }

    const rewrittenText = data.choices?.[0]?.message?.content;

    if (!rewrittenText) {
      return NextResponse.json({ error: "AI-მ პასუხი ვერ დააგენერირა" }, { status: 500 });
    }

    return NextResponse.json({ rewrittenText });

  } catch (error: unknown) {
    // Error handling any-ს გარეშე
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ AI_ROUTE_ERROR:", errorMessage);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}
