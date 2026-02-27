import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class CapsuleChain(Base, TimestampMixin):
    """A chain of connected time capsules that open in sequence."""

    __tablename__ = "capsule_chains"

    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_capsules: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    creator = relationship("User", back_populates="chains", lazy="selectin")
    capsules = relationship(
        "Capsule",
        back_populates="chain",
        lazy="selectin",
        order_by="Capsule.chain_order",
    )

    def __repr__(self) -> str:
        return f"<CapsuleChain(id={self.id}, title={self.title}, total={self.total_capsules})>"
