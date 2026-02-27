import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

import enum


class CapsuleCategory(str, enum.Enum):
    PERSONAL = "personal"
    FAMILY = "family"
    PROFESSIONAL = "professional"
    COMMUNITY = "community"


class Capsule(Base, TimestampMixin):
    """Time capsule model with encrypted content."""

    __tablename__ = "capsules"

    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    encrypted_content: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    category: Mapped[CapsuleCategory] = mapped_column(
        Enum(CapsuleCategory),
        default=CapsuleCategory.PERSONAL,
        nullable=False,
    )
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    open_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    is_opened: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    opened_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    chain_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("capsule_chains.id", ondelete="SET NULL"),
        nullable=True,
    )
    chain_order: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Relationships
    creator = relationship("User", back_populates="capsules", lazy="selectin")
    recipients = relationship(
        "CapsuleRecipient",
        back_populates="capsule",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    chain = relationship("CapsuleChain", back_populates="capsules", lazy="selectin")
    notifications = relationship(
        "Notification",
        back_populates="capsule",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Capsule(id={self.id}, title={self.title}, is_opened={self.is_opened})>"


class CapsuleRecipient(Base, TimestampMixin):
    """Tracks recipients for a capsule."""

    __tablename__ = "capsule_recipients"

    capsule_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("capsules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False)
    recipient_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    notified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    viewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    capsule = relationship("Capsule", back_populates="recipients")

    def __repr__(self) -> str:
        return f"<CapsuleRecipient(id={self.id}, email={self.recipient_email})>"
