"""Application route aggregation."""

from fastapi import APIRouter

from app.controllers.auth import router as auth_router
from app.controllers.capsules import router as capsules_router
from app.controllers.chains import router as chains_router
from app.controllers.notifications import router as notifications_router
from app.controllers.dashboard import router as dashboard_router

router = APIRouter(prefix="/api/v1")
router.include_router(auth_router)
router.include_router(capsules_router)
router.include_router(chains_router)
router.include_router(notifications_router)
router.include_router(dashboard_router)

# Main application router
app_router = router
