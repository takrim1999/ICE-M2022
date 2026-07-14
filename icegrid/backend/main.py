from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

import models
import schemas
import auth
from database import engine, Base, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/forgot-password")
def forgot_password(req: schemas.ForgotPassword, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == req.email).first()
    if not db_user:
        # Avoid revealing that the user does not exist
        return {"message": "If the email is registered, a password reset link has been generated."}
    
    # Generate a simple reset token
    reset_token = str(uuid.uuid4())
    db_user.reset_token = reset_token
    db.commit()
    
    # In a real app, send an email. Returning it here for demonstration.
    return {
        "message": "If the email is registered, a password reset link has been generated.", 
        "reset_token_demo": reset_token
    }

@app.post("/reset-password")
def reset_password(req: schemas.ResetPassword, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.reset_token == req.reset_token).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    db_user.hashed_password = auth.get_password_hash(req.new_password)
    db_user.reset_token = None
    db.commit()
    return {"message": "Password updated successfully"}

@app.get("/")
def root():
    return {"message": "Welcome to FastAPI Authentication API"}

@app.get("/hi/{name}")
def hi(name: str):
    return {"message": f"Hi {name}"}