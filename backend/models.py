from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

#User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    gender = Column(String(10), nullable=False)
    phone = Column(String(15), nullable=False)
    address_line1 = Column(String(100), nullable=False)
    address_line2 = Column(String(100))
    pin = Column(String(6), nullable=False)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)


#Employee model
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=False)
    employee_name = Column(String(50), nullable=False)
    employee_id = Column(String(10), nullable=False, unique=True)
    department = Column(String(50), nullable=False)
    profile = Column(String(50), nullable=False)


# State model
class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)  

# District model
class District(Base):   
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)