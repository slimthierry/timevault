import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken

from app.config.settings import settings


def _get_fernet_key() -> bytes:
    """Derive a valid 32-byte Fernet key from the settings encryption key.

    Fernet requires a URL-safe base64-encoded 32-byte key. We derive one by
    hashing the configured ENCRYPTION_KEY with SHA-256 and then base64 encoding it.
    """
    raw_key = settings.ENCRYPTION_KEY.encode("utf-8")
    hashed = hashlib.sha256(raw_key).digest()
    return base64.urlsafe_b64encode(hashed)


def _get_fernet() -> Fernet:
    """Create a Fernet cipher instance from the derived key."""
    return Fernet(_get_fernet_key())


def encrypt_content(plaintext: str) -> bytes:
    """Encrypt plaintext content using Fernet symmetric encryption.

    Args:
        plaintext: The string content to encrypt.

    Returns:
        Encrypted bytes that can be stored in the database.
    """
    fernet = _get_fernet()
    return fernet.encrypt(plaintext.encode("utf-8"))


def decrypt_content(encrypted: bytes) -> str:
    """Decrypt Fernet-encrypted content back to plaintext.

    Args:
        encrypted: The encrypted bytes from the database.

    Returns:
        The original plaintext string.

    Raises:
        InvalidToken: If the encrypted data is tampered with or the key is wrong.
    """
    fernet = _get_fernet()
    if isinstance(encrypted, str):
        encrypted = encrypted.encode("utf-8")
    return fernet.decrypt(encrypted).decode("utf-8")
