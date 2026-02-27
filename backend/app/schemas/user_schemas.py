from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    capsules_created: int
    capsules_received: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserSummary(BaseModel):
    id: UUID
    username: str

    model_config = {"from_attributes": True}
