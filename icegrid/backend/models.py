from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    reset_token = Column(String(255), nullable=True)
    credits = Column(Float, default=100.0)

    nodes = relationship("ResourceNode", back_populates="provider")
    rentals = relationship("RentalContract", back_populates="buyer")

class ResourceNode(Base):
    __tablename__ = "resource_nodes"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"))
    total_storage_gb = Column(Float, default=0.0)
    available_storage_gb = Column(Float, default=0.0)
    total_ram_gb = Column(Float, default=0.0)
    available_ram_gb = Column(Float, default=0.0)
    total_p_cores = Column(Integer, default=0)
    available_p_cores = Column(Integer, default=0)
    total_e_cores = Column(Integer, default=0)
    available_e_cores = Column(Integer, default=0)
    credits_per_hour = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)

    provider = relationship("User", back_populates="nodes")
    contracts = relationship("RentalContract", back_populates="node")

class RentalContract(Base):
    __tablename__ = "rental_contracts"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    node_id = Column(Integer, ForeignKey("resource_nodes.id"))
    storage_gb_rented = Column(Float, default=0.0)
    ram_gb_rented = Column(Float, default=0.0)
    p_cores_rented = Column(Integer, default=0)
    e_cores_rented = Column(Integer, default=0)
    status = Column(String, default="active") # active, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_cost = Column(Float, default=0.0)

    buyer = relationship("User", back_populates="rentals")
    node = relationship("ResourceNode", back_populates="contracts")
