from dotenv import load_dotenv
import os

print(f"Current CWD: {os.getcwd()}")
files = os.listdir('.')
print(f"Files in CWD: {files}")

load_dotenv()
key = os.environ.get("GEMINI_API_KEY")
print(f"Loaded Key: {key[:5]}..." if key else "Loaded Key: None")

import llm_service
print(f"LLM Service Key: {llm_service.API_KEY[:5]}..." if llm_service.API_KEY else "LLM Service Key: None")
