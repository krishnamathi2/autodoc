# Save as D:\autodoc-mvp\test_fix.py
import requests
import json

payload = {
    "alert_id": "GHSA-1234-5678-9012",
    "repository": "owner/repo",
    "alert_source": "github",
    "alert_data": {
        "package_name": "lodash",
        "vulnerable_version": "<4.17.21",
        "patched_version": "4.17.21",
        "severity": "high",
        "cve_id": "CVE-2021-1234"
    },
    "auto_merge": False,
    "add_tests": True
}

response = requests.post(
    "http://localhost:8000/v1/fix/create",
    json=payload
)

print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")