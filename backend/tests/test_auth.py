import pytest
from httpx import AsyncClient


class TestRegister:
    """Tests for the user registration endpoint."""

    async def test_register_success(self, client: AsyncClient):
        """Test successful user registration."""
        data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=data)

        assert response.status_code == 201
        body = response.json()
        assert "user" in body
        assert "tokens" in body
        assert body["user"]["email"] == data["email"]
        assert body["user"]["username"] == data["username"]
        assert body["tokens"]["access_token"]
        assert body["tokens"]["refresh_token"]
        assert body["tokens"]["token_type"] == "bearer"

    async def test_register_duplicate_email(self, client: AsyncClient):
        """Test that registering with a duplicate email fails."""
        data = {
            "email": "duplicate@example.com",
            "username": "user1",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=data)
        assert response.status_code == 201

        # Try to register with the same email
        data2 = {
            "email": "duplicate@example.com",
            "username": "user2",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=data2)
        assert response.status_code == 409
        assert "email" in response.json()["detail"].lower()

    async def test_register_duplicate_username(self, client: AsyncClient):
        """Test that registering with a duplicate username fails."""
        data = {
            "email": "user_a@example.com",
            "username": "sameusername",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=data)
        assert response.status_code == 201

        data2 = {
            "email": "user_b@example.com",
            "username": "sameusername",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=data2)
        assert response.status_code == 409
        assert "username" in response.json()["detail"].lower()

    async def test_register_short_password(self, client: AsyncClient):
        """Test that a short password is rejected."""
        data = {
            "email": "shortpw@example.com",
            "username": "shortpw",
            "password": "short",
        }
        response = await client.post("/api/v1/auth/register", json=data)
        assert response.status_code == 422


class TestLogin:
    """Tests for the user login endpoint."""

    async def test_login_success(self, client: AsyncClient):
        """Test successful login after registration."""
        # Register first
        register_data = {
            "email": "logintest@example.com",
            "username": "logintest",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/register", json=register_data)
        assert response.status_code == 201

        # Login
        login_data = {
            "email": "logintest@example.com",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/login", json=login_data)

        assert response.status_code == 200
        body = response.json()
        assert body["user"]["email"] == "logintest@example.com"
        assert body["tokens"]["access_token"]

    async def test_login_wrong_password(self, client: AsyncClient):
        """Test login with wrong password."""
        # Register first
        register_data = {
            "email": "wrongpw@example.com",
            "username": "wrongpw",
            "password": "securepassword123",
        }
        await client.post("/api/v1/auth/register", json=register_data)

        # Login with wrong password
        login_data = {
            "email": "wrongpw@example.com",
            "password": "wrongpassword",
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        """Test login with an email that does not exist."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "securepassword123",
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401


class TestMe:
    """Tests for the /auth/me endpoint."""

    async def test_get_me_authenticated(self, authenticated_client: AsyncClient):
        """Test getting the current user profile when authenticated."""
        response = await authenticated_client.get("/api/v1/auth/me")
        assert response.status_code == 200

        body = response.json()
        assert body["email"] == "testuser@example.com"
        assert body["username"] == "testuser"
        assert "id" in body
        assert "created_at" in body

    async def test_get_me_unauthorized(self, client: AsyncClient):
        """Test getting the current user profile without authentication."""
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 403
