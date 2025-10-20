from flask import Blueprint, request, jsonify
import subprocess

llm_bp = Blueprint('llm_chat', __name__, url_prefix='/chat')

def query_ollama(prompt: str) -> str:
    try:
        result = subprocess.run(
            ["ollama", "run", "llama3"],
            input=prompt.encode("utf-8"),
            capture_output=True,
            check=True
        )
        return result.stdout.decode("utf-8").strip()
    except Exception as e:
        print("Ollama error:", e)
        return "⚠️ Ollama is not available. Make sure it's running."

@llm_bp.route('/ask', methods=['POST'])
def ask_llm():
    data = request.json
    question = data.get('question')
    language = data.get('language', 'English')

    # 🧠 Get response from Ollama
    answer = query_ollama(question)

    return jsonify({"reply": f"[{language}] {answer}"})
