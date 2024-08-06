import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the API key from an environment variable (recommended)
API_KEY = os.getenv("GEMINI_API_KEY")

# Check if API key is present, raise an error if not
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")

genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

models = {
    "Michael": genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config=generation_config,
        system_instruction="You are Michael from GTA 5. I am your friend, talk to me..." 
        # add the detailed instruction for Michael here
    ),
    "Trevor": genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config=generation_config,
        system_instruction="You are Trevor from GTA 5. I am your friend, talk to me..."
        # add the detailed instruction for Trevor here
    ),
    "Franklin": genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config=generation_config,
        system_instruction="You are Franklin from GTA 5. I am your friend, talk to me..."
        # add the detailed instruction for Franklin here
    ),
}

history = {
    "Michael": [],
    "Trevor": [],
    "Franklin": []
}

@app.route('/')
def index():
    return render_template('michael.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    user_input = data.get('input')
    personality = data.get('personality', 'Michael')
    
    if user_input and personality in models:
        model = models[personality]
        
        # Adding user's input to the history
        history[personality].append({"role": "user", "parts": [user_input]})

        # Generating the response from the model
        response = model.generate_content(
            [user_input],
            safety_settings={
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE
            }
        )

        model_response = response.text

        # Adding model's response to the history
        history[personality].append({"role": "model", "parts": [model_response]})

        return jsonify({"message": model_response})

    return jsonify({"error": "No input or invalid personality provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
