from flask import Blueprint, request, jsonify

# ✅ Blueprint for chat routes
llm_bp = Blueprint('llm_chat', __name__, url_prefix='/chat')

@llm_bp.route('/ask', methods=['POST'])
def ask_llm():
    """
    This route receives a question from the frontend and returns
    a clean string reply to avoid React rendering errors.
    """
    try:
        data = request.json or {}
        question = data.get('question', '')
        language = data.get('language', 'english')

        # 🧠 Placeholder response (you can later plug Ollama or OpenAI here)
        answer = f"[{language}] Answer to: {question}"

        # ⚠️ Important: Convert to string to avoid 'Objects are not valid as a React child'
        return jsonify({"reply": str(answer)})

    except Exception as e:
        print(f"❌ Chatbot error: {e}")
        return jsonify({"reply": "⚠️ Something went wrong, please try again."}), 500
