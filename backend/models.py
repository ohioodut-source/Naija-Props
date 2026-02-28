from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profile_picture_url = Column(String, nullable=True)
    role = Column(String, default="Client") # Client, Agent, Developer, Landlord
    phone_number = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)

    properties = relationship("Property", back_populates="owner")
    kyc_document = relationship("KYCDocument", back_populates="user", uselist=False)

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Integer)
    location = Column(String, index=True) # Abuja or Lagos
    type = Column(String, index=True) # Rent or Buy
    category = Column(String, index=True, default="House") # Apartment, Beach House, Shop/Plaza, Event Location, Airbnb
    rental_period = Column(String, nullable=True) # Daily, Monthly, Yearly
    min_duration = Column(Integer, nullable=True)
    max_duration = Column(Integer, nullable=True)
    image_url = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    document_url = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="properties")

class KYCDocument(Base):
    __tablename__ = "kyc_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    document_type = Column(String) # ID Card, Passport, Driver's License
    file_url = Column(String)
    status = Column(String, default="Pending") # Pending, Approved, Rejected

    user = relationship("User", back_populates="kyc_document")
