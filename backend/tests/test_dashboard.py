import pytest
from httpx import AsyncClient


class TestDashboard:
    """Tests for dashboard endpoints."""

    async def test_get_stats_authenticated(self, authenticated_client: AsyncClient):
        """Test getting dashboard stats when authenticated."""
        response = await authenticated_client.get("/api/v1/dashboard/stats")
        assert response.status_code == 200

        body = response.json()
        assert "capsules_created" in body
        assert "capsules_received" in body
        assert "capsules_opened" in body
        assert body["capsules_created"] == 0
        assert body["capsules_received"] == 0
        assert body["capsules_opened"] == 0

    async def test_get_stats_unauthorized(self, client: AsyncClient):
        """Test that dashboard stats require authentication."""
        response = await client.get("/api/v1/dashboard/stats")
        assert response.status_code == 403

    async def test_get_timeline_authenticated(self, authenticated_client: AsyncClient):
        """Test getting the timeline when authenticated."""
        response = await authenticated_client.get("/api/v1/dashboard/timeline")
        assert response.status_code == 200

        body = response.json()
        assert isinstance(body, list)

    async def test_get_timeline_unauthorized(self, client: AsyncClient):
        """Test that timeline requires authentication."""
        response = await client.get("/api/v1/dashboard/timeline")
        assert response.status_code == 403

    async def test_get_upcoming_authenticated(self, authenticated_client: AsyncClient):
        """Test getting upcoming capsules when authenticated."""
        response = await authenticated_client.get("/api/v1/dashboard/upcoming")
        assert response.status_code == 200

        body = response.json()
        assert isinstance(body, list)

    async def test_get_upcoming_unauthorized(self, client: AsyncClient):
        """Test that upcoming capsules require authentication."""
        response = await client.get("/api/v1/dashboard/upcoming")
        assert response.status_code == 403
