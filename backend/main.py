from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import models, schemas, database

# Authentication Configuration
SECRET_KEY = "your-secret-key-keep-it-secret" # In production, use env variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Utils
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        if sub is None:
            raise credentials_exception
            
        if str(sub).isdigit():
            user = db.query(models.User).filter(models.User.id == int(sub)).first()
        else:
            user = db.query(models.User).filter(models.User.email == str(sub)).first()
    except (JWTError, ValueError):
        raise credentials_exception
        
    if user is None:
        raise credentials_exception
    return user

# Auth Endpoints
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    if user.username:
        db_username = db.query(models.User).filter(models.User.username == user.username).first()
        if db_username:
            raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    
    db_user = models.User(
        email=user.email, 
        username=user.username,
        full_name=user.full_name, 
        hashed_password=hashed_password,
        role=user.role,
        phone_number=user.phone_number,
        date_of_birth=user.date_of_birth,
        is_verified=False
    )
    db.add(db_user)
    db.flush() # Flush to assign an ID to db_user before linking KYCDocument
    
    if user.id_document_url and user.id_document_type:
        db_document = models.KYCDocument(
            user_id=db_user.id,
            document_type=user.id_document_type,
            file_url=user.id_document_url,
            status="Approved" # Auto-approve for demo purposes
        )
        db.add(db_document)
        db_user.is_verified = True

    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.User)
def update_user_me(
    user_update: schemas.UserUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if user_update.email is not None and user_update.email != current_user.email:
        if db.query(models.User).filter(models.User.email == user_update.email).first():
             raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = user_update.email
        
    if user_update.username is not None and user_update.username != current_user.username:
        if db.query(models.User).filter(models.User.username == user_update.username).first():
             raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username

    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.profile_picture_url is not None:
        current_user.profile_picture_url = user_update.profile_picture_url
        
    db.commit()
    db.refresh(current_user)
    return current_user

# KYC Endpoints
@app.post("/kyc/upload", response_model=schemas.KYCDocumentResponse)
def upload_kyc_document(
    document: schemas.KYCDocumentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    existing_doc = db.query(models.KYCDocument).filter(models.KYCDocument.user_id == current_user.id).first()
    if existing_doc:
        raise HTTPException(status_code=400, detail="KYC Document already submitted.")
        
    db_document = models.KYCDocument(**document.dict(), user_id=current_user.id)
    # Auto-approve for demo functionality
    db_document.status = "Approved"
    current_user.is_verified = True
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/kyc/status", response_model=schemas.KYCDocumentResponse)
def get_kyc_status(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    document = db.query(models.KYCDocument).filter(models.KYCDocument.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=404, detail="KYC Document not found")
    return document

# Property Endpoints
@app.get("/properties", response_model=List[schemas.Property])
def read_properties(
    q: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Property)
    if q:
        query = query.filter(models.Property.title.contains(q))
    if location:
        query = query.filter(models.Property.location == location)
    if min_price:
        query = query.filter(models.Property.price >= min_price)
    if max_price:
        query = query.filter(models.Property.price <= max_price)
    if type:
        query = query.filter(models.Property.type == type)
    
    return query.all()

@app.get("/properties/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(get_db)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property

@app.post("/properties", response_model=schemas.Property)
def create_property(
    property: schemas.PropertyCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_verified:
        raise HTTPException(status_code=403, detail="KYC verification required to post properties.")

    db_property = models.Property(**property.dict(), owner_id=current_user.id)
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property
