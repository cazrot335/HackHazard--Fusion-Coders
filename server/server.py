import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow warnings

from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)

# Load a pre-trained model (e.g., GPT-2 or CodeParrot)
model_name = "gpt2"  # Replace with a code-specific model like "huggingface/CodeParrot"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/code-completion', methods=['POST'])
def code_completion():
    data = request.json
    code = data.get("code", "")

    # Generate a completion
    inputs = tokenizer.encode(code, return_tensors="pt")
    outputs = model.generate(inputs, max_length=100, num_return_sequences=1)
    completion = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Limit the completion to 100 characters
    truncated_completion = completion[:100]

    # Return only the new completion (exclude the input code)
    return jsonify({"completion": truncated_completion})

if __name__ == '__main__':
    app.run(port=5001)