from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import schemas, crud
from database import get_db
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users"]) #tags for grouping docs

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserBase, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.get("/", response_model=None) # For pagination
def get_users(
    db: Session = Depends(get_db), 
    limit: int = Query(5, ge=1), 
    offset: int = Query(0, ge=0),
    gender: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    phone: Optional[str] = None,
    pin: Optional[str] = None
):
    return crud.get_users(
        db, limit=limit, offset=offset,
        gender=gender, district=district,
        search=search, phone=phone, pin=pin
    )

@router.get("/last", response_model=schemas.UserResponse)
def get_last_user(db: Session = Depends(get_db)):
    user = crud.get_last_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No users found")
    return user

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    return user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserBase, db: Session = Depends(get_db)):
    updated_user = crud.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found!")
    return updated_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db:Session = Depends(get_db)):
    if not crud.delete_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found!")
    return {"message": "User deleted successfully"}