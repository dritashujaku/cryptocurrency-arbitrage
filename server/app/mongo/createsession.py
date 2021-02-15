from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine

from app.mongo import settings

client = AsyncIOMotorClient(settings.mongodb_uri)
engine = AIOEngine(motor_client=client, database=settings.db)