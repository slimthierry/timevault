from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User account model."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    username: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    capsules_created: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    capsules_received: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    capsules = relationship(
        "Capsule", back_populates="creator", lazy="selectin"
    )
    chains = relationship(
        "CapsuleChain", back_populates="creator", lazy="selectin"
    )
    notifications = relationship(
        "Notification", back_populates="user", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
