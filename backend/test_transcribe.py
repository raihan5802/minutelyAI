import requests


BASE_URL = "http://localhost:8000"


def test_health():
	response = requests.get(f"{BASE_URL}/health")
	print("Health check:", response.json())
	assert response.status_code == 200


def test_text_endpoint():
	payload = {
		"text": "Alice will send the proposal by Friday. Bob agreed to review the Q3 budget. The team still needs to decide on the launch date."
	}
	response = requests.post(f"{BASE_URL}/api/transcribe/text", json=payload)
	data = response.json()
	print("Text endpoint:", data)
	assert "transcript" in data
	assert "word_count" in data


if __name__ == "__main__":
	test_health()
	test_text_endpoint()
	print("All Phase 1 tests passed.")
