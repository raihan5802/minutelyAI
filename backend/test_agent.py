import requests
import json


BASE_URL = "http://localhost:8000"

sample_transcript = "Sarah opened the meeting and said the product launch is moving to March 15th because the design team needs two more weeks. John agreed and said he will update the project timeline by end of day Friday. Maria raised a concern about the marketing budget — she said it is still not approved and asked who is responsible for getting sign-off. Sarah said she will follow up with the finance team by Thursday. The team discussed whether to use paid ads or organic social for the launch but did not reach a conclusion. John mentioned he still needs the final copy from the content team before he can finish the landing page."


def test_analyze_endpoint():
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={"transcript": sample_transcript}
    )
    
    response_json = response.json()
    print("Agent response:")
    print(json.dumps(response_json, indent=2))
    
    assert response.status_code == 200
    assert "summary" in response_json
    assert "action_items" in response_json
    assert len(response_json["action_items"]) > 0
    assert response_json["model_used"] == "DeepSeek V3"
    
    print("Phase 2 complete — LangGraph agent is working.")


if __name__ == "__main__":
    test_analyze_endpoint()
