from sqlalchemy.orm import Session
import schemas, models

#User CRUD
def create_user(db: Session, user: schemas.UserBase):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, limit: int = 5, offset: int = 0, 
              gender: str = None, district: str = None, 
              search: str = None, phone: str = None, pin: str = None):
    query = db.query(models.User)
    
    # Apply filters
    if gender:
        query = query.filter(models.User.gender == gender)
    if district:
        query = query.filter(models.User.district == district)
    if phone:
        query = query.filter(models.User.phone.like(f"%{phone}%"))
    if pin:
        query = query.filter(models.User.pin.like(f"%{pin}%"))
    
    # Apply name search
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (models.User.firstname.ilike(search_pattern)) | 
            (models.User.lastname.ilike(search_pattern))
        )
    
    # Get total count (for pagination)
    total = query.count()
    
    # Apply pagination
    users = query.offset(offset).limit(limit).all()
    
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

def get_employees(db: Session, limit: int = 10, offset: int = 0, 
                 department: str = None, profile: str = None, search: str = None,
                 employee_id: str = None):
    query = db.query(models.Employee)
    
    # Apply filters
    if department:
        query = query.filter(models.Employee.department == department)
    if profile:
        query = query.filter(models.Employee.profile == profile)
    
    # Apply name search
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(models.Employee.employee_name.ilike(search_pattern))
    
    # Apply employee ID search
    if employee_id:
        query = query.filter(models.Employee.employee_id.like(f"%{employee_id}%"))
    
    # Get total count (for pagination)
    total = query.count()
    
    # Apply pagination
    employees = query.offset(offset).limit(limit).all()
    
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
