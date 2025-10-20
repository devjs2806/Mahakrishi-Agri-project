import React from "react";
import LLMChatBox from "../components/LLMChatBox";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800">🌱 Ask MahaKrishi</h1>
        <p className="text-gray-600 mt-2">
          Chat with AI for farming guidance and recommendations.
        </p>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border">
        <LLMChatBox />
      </div>
    </div>
  );
}
