from sqlalchemy.orm import Session
import schemas, models

#User CRUD
def create_user(db: Session, user: schemas.UserBase):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, limit: int = 5, offset: int = 0):
    users = db.query(models.User).offset(offset).limit(limit).all()
    total = db.query(models.User).count()
    return {"users": users, "total": total}

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user(db: Session, user_id: int, user: schemas.UserBase):
    db_user = get_user(db, user_id)
    if db_user:
        for key, value in user.model_dump().items():
            setattr(db_user, key, value)            #db_user.key = value
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def get_last_user(db: Session):
    return db.query(models.User).order_by(models.User.id.desc()).first()


#Employee CRUD
def create_employee(db: Session, emp: schemas.EmployeeBase):
    db_emp = models.Employee(**emp.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def get_employees(db: Session, limit: int = 10, offset: int = 0):
    employees = db.query(models.Employee).offset(offset).limit(limit).all()
    total = db.query(models.Employee).count()
    return {"employees": employees, "total": total}

def get_employee(db: Session, emp_id: int):
    return db.query(models.Employee).filter(models.Employee.id == emp_id).first()

def update_employee(db: Session, emp_id: int, emp: schemas.EmployeeBase):
    db_emp = get_employee(db, emp_id)
    if db_emp:
        for key, value in emp.model_dump().items():
            setattr(db_emp, key, value)
        db.commit()
        db.refresh(db_emp)
    return db_emp

def delete_employee(db: Session, emp_id: int):
    db_emp = get_employee(db, emp_id)
    if db_emp:
        db.delete(db_emp)
        db.commit()
        return True
    return False


# State and District CRUD
def get_districts(db: Session):
    return db.query(models.District).all()

def get_states(db: Session):
    return db.query(models.State).all()
