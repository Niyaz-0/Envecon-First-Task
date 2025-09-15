from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud
from database import get_db

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=schemas.EmployeeResponse)
def create_employee(emp: schemas.EmployeeBase, db: Session = Depends(get_db)):
    return crud.create_employee(db, emp)

@router.get("/", response_model=list[schemas.EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@router.get("/{emp_id}", response_model=schemas.EmployeeResponse)
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    employee = crud.get_employee(db, emp_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found!")
    return employee

@router.put("/{emp_id}", response_model=schemas.EmployeeResponse)
def update_employee(emp_id: int, emp: schemas.EmployeeBase, db: Session = Depends(get_db)):
    updated = crud.update_employee(db, emp_id ,emp)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found!")
    return updated

@router.delete("/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    if not crud.delete_employee(db, emp_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}