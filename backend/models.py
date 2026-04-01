from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    industry = Column(String)
    size = Column(String)
    headquarters = Column(String)
    description = Column(Text)
    culture = Column(Text)
    tech_stack = Column(Text)          # stored as JSON string
    glassdoor_rating = Column(Float)
    website = Column(String)
    logo_color = Column(String)        # hex color for UI

    skills = relationship("Skill", back_populates="company", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="company", cascade="all, delete-orphan")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    level = Column(String)             # Entry / Mid / Senior

    skills = relationship("Skill", back_populates="role", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="role", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String)          # Frontend, Backend, DevOps, etc.
    importance = Column(String)        # Critical / High / Medium / Nice-to-have
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    course_title = Column(String)
    course_provider = Column(String)
    course_url = Column(String)
    course_price = Column(String)

    role = relationship("Role", back_populates="skills")
    company = relationship("Company", back_populates="skills")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text)
    difficulty = Column(String)        # Easy / Medium / Hard
    category = Column(String)          # DSA, System Design, Behavioral, etc.
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)

    role = relationship("Role", back_populates="interview_questions")
    company = relationship("Company", back_populates="interview_questions")
