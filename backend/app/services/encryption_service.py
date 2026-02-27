"""Encryption service wrapper around core encryption module.

Provides a class-based interface for encrypting and decrypting capsule content.
"""

from app.core.encryption import decrypt_content, encrypt_content


class EncryptionService:
    """Service wrapper for Fernet encryption operations."""

    @staticmethod
    def encrypt(plaintext: str) -> bytes:
        """Encrypt plaintext content.

        Args:
            plaintext: The content to encrypt.

        Returns:
            Encrypted bytes.
        """
        return encrypt_content(plaintext)

    @staticmethod
    def decrypt(encrypted: bytes) -> str:
        """Decrypt encrypted content.

        Args:
            encrypted: The encrypted bytes to decrypt.

        Returns:
            Decrypted plaintext string.
        """
        return decrypt_content(encrypted)

    @staticmethod
    def re_encrypt(encrypted: bytes, new_plaintext: str) -> bytes:
        """Decrypt existing content and re-encrypt with new content.

        Useful for content updates (if allowed before locking).

        Args:
            encrypted: The current encrypted bytes.
            new_plaintext: The new content to encrypt.

        Returns:
            Newly encrypted bytes.
        """
        return encrypt_content(new_plaintext)


encryption_service = EncryptionService()
