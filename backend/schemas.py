from pydantic import BaseModel
from typing import Optional

#User schemas
class UserBase(BaseModel):
    firstname: str
    lastname: str
    gender: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    pin: str
    district: str
    state: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


#Employee Schemas
class EmployeeBase(BaseModel):
    employee_name: str
    employee_id: str
    department: str
    profile: str

class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        from_attributes = True


# State and District Schemas
class District(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class State(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True