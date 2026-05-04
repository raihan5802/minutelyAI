import json

import requests


BASE_URL = "http://localhost:8000"


def test_notion_export() -> None:
	payload = {
		"meeting_title": "Q3 Planning Meeting — MinutelyAI Test",
		"summary": "The team discussed the Q3 roadmap and agreed on two major feature launches. Sarah will lead the dashboard redesign starting July 15th. Budget was approved for contractor hiring.",
		"action_items": [
			"TASK: Send job brief to HR | OWNER: Sarah | DUE: End of week",
			"TASK: Update project timeline | OWNER: John | DUE: Thursday",
		],
		"decisions": [
			"Dashboard redesign approved for Q3",
			"Two contractors approved for engineering team",
		],
		"open_questions": [
			"Mobile dashboard scope still not defined.",
		],
	}

	response = requests.post(f"{BASE_URL}/api/export/notion", json=payload, timeout=30)
	response_json = response.json()

	print("Notion export response:")
	print(json.dumps(response_json, indent=2))

	assert response.status_code == 200
	assert "page_url" in response_json
	assert "page_id" in response_json

	print("Phase 4 complete — Notion export is working.")
	print("Open this page in Notion: " + response_json["page_url"])


if __name__ == "__main__":
	test_notion_export()
