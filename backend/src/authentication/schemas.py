from ninja import Schema
from typing import Optional
from datetime import datetime
import uuid

class UserRegistrationSchema(Schema):
    """Schema for user registration"""
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    additional_info: Optional[str] = None
    password: str
    password_confirm: str
    language_pref: Optional[str] = 'en'

class UserLoginSchema(Schema):
    """Schema for user login"""
    email: str
    password: str

class UserProfileSchema(Schema):
    """Schema for user profile response"""
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    additional_info: Optional[str] = None
    photo_url: Optional[str] = None
    language_pref: str = 'en'
    created_at: datetime
    updated_at: datetime

class UserUpdateSchema(Schema):
    """Schema for updating user profile"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    additional_info: Optional[str] = None
    photo_url: Optional[str] = None
    language_pref: Optional[str] = None

class TokenResponseSchema(Schema):
    """Schema for authentication token response"""
    user: UserProfileSchema
    access: str
    refresh: str

class ForgotPasswordSchema(Schema):
    """Schema for forgot password request"""
    email: str

class ResetPasswordSchema(Schema):
    """Schema for password reset"""
    token: str
    new_password: str
    confirm_password: str

class ChangePasswordSchema(Schema):
    """Schema for changing password"""
    current_password: str
    new_password: str
    confirm_password: str

class MessageResponseSchema(Schema):
    """Schema for simple message responses"""
    message: str
    success: bool = True
