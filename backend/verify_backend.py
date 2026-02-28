import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_backend():
    print("Testing Backend API...")
    
    # 1. Register User
    print("\n1. Testing Registration...")
    email = "test@example.com"
    password = "password123"
    register_payload = {
        "email": email,
        "password": password,
        "full_name": "Test User"
    }
    
    # Clean up if exists (optional, or just handle 400)
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
        if response.status_code == 200:
            print("SUCCESS: Registration Successful")
        elif response.status_code == 400:
             print("INFO: User already registered (Expected if running twice)")
        else:
            print(f"FAILURE: Registration Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"FAILURE: Connection Failed: {e}")
        return

    # 2. Login
    print("\n2. Testing Login...")
    login_payload = {
        "username": email,
        "password": password
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data=login_payload)
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data["access_token"]
            print("SUCCESS: Login Successful")
        else:
            print(f"FAILURE: Login Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"FAILURE: Connection Failed: {e}")
        return

    # 3. Post Property (Authenticated)
    print("\n3. Testing Post Property (Authenticated)...")
    headers = {"Authorization": f"Bearer {access_token}"}
    property_payload = {
        "title": "Test Apartment",
        "description": "A nice test apartment",
        "price": 1500000,
        "location": "Abuja",
        "type": "Rent",
        "bedrooms": 2,
        "bathrooms": 2,
        "image_url": "https://example.com/image.jpg"
    }
    
    response = requests.post(f"{BASE_URL}/properties", json=property_payload, headers=headers)
    if response.status_code == 200:
        property_data = response.json()
        property_id = property_data["id"]
        print(f"SUCCESS: Post Property Successful (ID: {property_id})")
        
        # Verify Owner ID is set (if returned)
        if "owner_id" in property_data:
             print(f"SUCCESS: Owner ID Correctly Set: {property_data['owner_id']}")
    else:
        print(f"FAILURE: Post Property Failed: {response.status_code} - {response.text}")
        return

    # 4. Get Property Details
    print("\n4. Testing Get Property Details...")
    response = requests.get(f"{BASE_URL}/properties/{property_id}")
    if response.status_code == 200:
        data = response.json()
        if data["id"] == property_id:
             print("SUCCESS: Get Property Details Successful")
        else:
             print("FAILURE: Property Details Mismatch")
    else:
         print(f"FAILURE: Get Property Failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_backend()
