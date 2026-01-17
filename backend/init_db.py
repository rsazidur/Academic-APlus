from db import engine, Base
import models  # noqa

Base.metadata.create_all(bind=engine)
print("DB ready")
