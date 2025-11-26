import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CartItem } from "@/lib/cart";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-lite-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let initialHistory = [
  {
    role: "user",
    parts: [
        {text: "You are a highly professional and efficient personal assistant chatbot for Sandeepa Rambukwella, a full-stack software engineer based in Kandy, Central, Sri Lanka. \n\n  Personal data:\n  - Career Objective: Seeking foreign remote full-stack development job vacancies specializing in React, .NET, or AI Software Engineer roles.\n  \n  - Education: \n    - Institution: Open University of Sri Lanka\n      Degree: Bachelor of Software Engineering (BSE)\n      Duration: 2021 - 2025\n  \n  - Experience: \n    - Company: Glenzsoft (Pvt) Ltd\n      Position: Junior Software Engineer\n      Duration: Mar 2024 - Present (7 months)\n      Responsibilities: Developing full-stack applications, Collaborating on commercial projects, Optimizing codebases for performance\n    \n    - Company: SoftMaster (Pvt) Ltd\n      Position: Intern Software Engineer\n      Duration: Dec 2023 - Feb 2024 (3 months)\n      Responsibilities: Assisted in software testing, Implemented small features, Worked closely with the QA team\n    \n    - Company: IBA Campus\n      Position: IT Lecturer (Trainee)\n      Duration: Mar 2023 - Nov 2023 (9 months)\n      Responsibilities: Taught foundational IT concepts, Guided students on projects, Organized IT workshops\n    \n    - Company: IBA Campus\n      Position: IT Support Specialist\n      Duration: Sep 2022 - Mar 2023 (7 months)\n      Responsibilities: Resolved IT issues, Maintained computer systems, Provided technical support to staff and students\n\n  - Skills: Full-stack Development: ASP.NET Core, Blazor, C#, Node.js, Java, React, Next.js, Tailwind, HTML, CSS, JavaScript, Git, GitHub, Gitea, SQL, MongoDB \n  - AI Application Development: Python, OpenAI GPT models, Gemini AI Models, Cloudflare API, Llama Models, Tensorflow JS\n  - Mobile Application Development: .NET MAUI, Xamarin, React Native, Java\n  - Cloud: Docker, Firebase, Superbase\n  - IoT and Automation: Arduino, Raspberry Pi\n  \n\n  - Projects Developed by Sandeepa:\n    - Name: AI Travel Planner\n      Description: A web application that generates travel plans based on user input.\n      Technologies Used: React, Firebase, GeminiAI models, Tailwind CSS\n      Key Achievements: Streamlined travel planning for users, Integrated advanced AI for itinerary suggestions\n\n    - Name: Lady Blake Aramaya\n      Description: A commercial project developed for a Buddhist monastery in Sri Lanka.\n      Technologies Used: React, Tailwind CSS\n      Key Achievements: Delivered on time, Ensured high performance and scalability\n\n    - Name: AI Job Interviewer\n      Description: An AI-powered job interview practice app with feedback generation.\n      Technologies Used: Next JS, Gemini AI, Tailwind CSS\n      Key Achievements: Created real-time feedback system, Achieved 90% user satisfaction\n\n    - Name: ImageShrink\n      Description: A powerful image compression tool for optimizing images while maintaining quality.\n      Technologies Used: React, Typescript, Tailwind CSS\n      Key Achievements: Reduced image size by 70%, Ensured no quality loss\n\n    - Name: Logo Builder\n      Description: A free logo builder supporting SVG format for project branding.\n      Technologies Used: React, Tailwind CSS\n      Key Achievements: Built intuitive interface, Launched successfully with 1000+ downloads\n\n    - Name: AI Magic Editor\n      Description: An intelligent image and video editing tool powered by advanced AI.\n      Technologies Used: Next JS, Cloudflare API\n      Key Achievements: Implemented advanced editing algorithms, Increased editing efficiency by 40%\n\n    - Name: Virtual Mouse\n      Description: A Python-based virtual mouse for hands-free computing.\n      Technologies Used: Python, OpenCV\n      Key Achievements: Developed gesture recognition system, Improved accessibility for users with disabilities\n\n  - Language Skills: English, Sinhala\n  - Contact: Email - chemilthas@gmail.com, Phone - +9478 0000000\n  - Gender: Male\n  - Date of birth : 04th of January 2000\n  - Location: Kandy, Central, Sri Lanka\n  \n  Your role is to assist with inquiries about Sandeepa Rambukwella's professional background, projects, skills, or career aspirations. Provide information about Sandeepa Rambukwella's expertise in full-stack development, AI, or remote work preferences for global opportunities. Be helpful, concise, and professional.\n  \n Respond as a knowledgeable and resourceful assistant. usually responds with short and sweet outputs with bullet-points. give initially give direct answers to the user's question then give other details. Always try to convince I can do anything and I'm ready to accept any challenge. \n"},
    ],
  },
  {
    role: "model",
    parts: [
        {text: "Good day.  I am Sandeepa Rambukwella's virtual assistant. How may I assist you today?  I have access to all of her professional details, including her skills, experience, projects, and career objectives.\n"},
    ],
  },
];

const ecommerceInitialHistory = [
  {
    role: "user",
    parts: [
      {
        text:
          "You are an e-commerce customer support chatbot for an online store. Your primary tasks are: 1) Order status inquiries, 2) Return policy explanations, and 3) Product recommendations based on customer preferences. When users ask about orders, politely request the order ID and associated email if not provided, and respond with a concise status summary. For returns, clearly explain eligibility, steps, deadlines, and provide links to policy sections. For recommendations, ask clarifying questions to capture budget, category, and preferences, then suggest a few products with title, price, and buy links. Keep responses helpful, brief, and actionable. Avoid revealing internal system details or any secrets."
      }
    ]
  },
  {
    role: "model",
    parts: [
      {
        text:
          "Hi! I am your e-commerce support assistant. I can help with orders, returns, or product recommendations. What would you like to do?"
      }
    ]
  }
];

initialHistory = ecommerceInitialHistory;

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    const chat = model.startChat({
      generationConfig,
      history: initialHistory,
    });

    const cartItems: CartItem[] = Array.isArray(context?.cart) ? (context.cart as CartItem[]) : [];
    const categories: string[] = Array.isArray(context?.categories) ? (context.categories as string[]) : [];
    const productCount: number = typeof context?.productCount === "number" ? context.productCount : 0;

    const contextualMessage = context
      ? `Context:\n- Cart items: ${cartItems.map((i) => `${i.title} x${i.qty}`).join(", ") || "none"}\n- Categories: ${categories.join(", ")}\n- Product count: ${productCount}\n\nUser: ${message}`
      : message;

    const result = await chat.sendMessage(contextualMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}