"""
Academic A+ Plus API Application
"""

from .core.config import settings
from .routes import router

__version__ = "1.0.0"

__all__ = ["settings", "router", "__version__"]
