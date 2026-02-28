from pydantic import BaseModel
from typing import Optional

class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: int
    location: str
    type: str
    category: Optional[str] = "House"
    rental_period: Optional[str] = None
    min_duration: Optional[int] = None
    max_duration: Optional[int] = None
    image_url: str
    bedrooms: int
    bathrooms: int
    document_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    role: Optional[str] = "Client"
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

class UserCreate(UserBase):
    password: str
    id_document_type: Optional[str] = None
    id_document_url: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool = True
    is_verified: bool = False
    properties: list[Property] = []

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class KYCDocumentBase(BaseModel):
    document_type: str
    file_url: str

class KYCDocumentCreate(KYCDocumentBase):
    pass

class KYCDocumentResponse(KYCDocumentBase):
    id: int
    user_id: int
    status: str

    class Config:
        orm_mode = True
