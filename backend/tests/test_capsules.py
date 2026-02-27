import pytest
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient


class TestCreateCapsule:
    """Tests for capsule creation."""

    async def test_create_capsule_success(self, authenticated_client: AsyncClient):
        """Test creating a capsule with valid data."""
        open_date = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        data = {
            "title": "Test Capsule",
            "content": "This is a secret message for the future.",
            "category": "personal",
            "is_public": False,
            "open_date": open_date,
        }
        response = await authenticated_client.post(
            "/api/v1/capsules/create", json=data
        )

        assert response.status_code == 201
        body = response.json()
        assert body["title"] == "Test Capsule"
        assert body["category"] == "personal"
        assert body["is_public"] is False
        assert body["is_opened"] is False
        assert "id" in body
        assert "creator" in body

    async def test_create_capsule_with_recipients(
        self, authenticated_client: AsyncClient
    ):
        """Test creating a capsule with recipient emails."""
        open_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        data = {
            "title": "Capsule with Recipients",
            "content": "A message for friends.",
            "category": "family",
            "is_public": True,
            "open_date": open_date,
            "recipient_emails": ["friend@example.com"],
        }
        response = await authenticated_client.post(
            "/api/v1/capsules/create", json=data
        )

        assert response.status_code == 201
        body = response.json()
        assert body["title"] == "Capsule with Recipients"
        assert body["is_public"] is True

    async def test_create_capsule_unauthorized(self, client: AsyncClient):
        """Test that creating a capsule without auth fails."""
        open_date = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        data = {
            "title": "Unauthorized Capsule",
            "content": "Should fail.",
            "category": "personal",
            "is_public": False,
            "open_date": open_date,
        }
        response = await client.post("/api/v1/capsules/create", json=data)
        assert response.status_code == 403


class TestListCapsules:
    """Tests for listing capsules."""

    async def test_list_my_capsules_empty(self, authenticated_client: AsyncClient):
        """Test listing capsules when none exist."""
        response = await authenticated_client.get("/api/v1/capsules/my-capsules")
        assert response.status_code == 200

        body = response.json()
        assert body["capsules"] == []
        assert body["total"] == 0

    async def test_list_my_capsules_after_create(
        self, authenticated_client: AsyncClient
    ):
        """Test listing capsules after creating one."""
        # Create a capsule first
        open_date = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        data = {
            "title": "Listed Capsule",
            "content": "This will appear in the list.",
            "category": "professional",
            "is_public": False,
            "open_date": open_date,
        }
        create_response = await authenticated_client.post(
            "/api/v1/capsules/create", json=data
        )
        assert create_response.status_code == 201

        # List capsules
        response = await authenticated_client.get("/api/v1/capsules/my-capsules")
        assert response.status_code == 200

        body = response.json()
        assert body["total"] == 1
        assert len(body["capsules"]) == 1
        assert body["capsules"][0]["title"] == "Listed Capsule"

    async def test_list_public_capsules(self, client: AsyncClient):
        """Test listing public capsules (no auth required)."""
        response = await client.get("/api/v1/capsules/public")
        assert response.status_code == 200

        body = response.json()
        assert "capsules" in body
        assert "total" in body
