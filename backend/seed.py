from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Recreate tables just in case (optional, but harmless if they exist)
models.Base.metadata.create_all(bind=engine)

def seed_db():
    db: Session = SessionLocal()
    try:
        # Clear existing properties
        print("Clearing existing properties...")
        db.query(models.Property).delete()
        db.commit()

        # Check if we have at least one user to assign properties to
        owner = db.query(models.User).first()
        owner_id = owner.id if owner else None
        
        if not owner_id:
            # Create a dummy admin user if none exists
            print("No users found. Creating a default admin user...")
            owner = models.User(
                email="admin@naijaprops.com",
                username="admin",
                full_name="NaijaProps Admin",
                hashed_password="hashed_dummy_password" # Not usable for real login, but needed for schema
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)
            owner_id = owner.id

        # Define the exact 4 properties
        properties_to_add = [
            models.Property(
                title="Modern 4-Bedroom Duplex in Maitama",
                description="Luxurious duplex located in the heart of Maitama, Abuja. Features spacious living areas, a fully fitted kitchen, and a private garden. Perfect for families looking for comfort and security.",
                price=250000000,
                location="Abuja",
                type="Buy",
                category="House",
                rental_period=None,
                image_url="/properties/property-4.jpg",
                bedrooms=4,
                bathrooms=5,
                owner_id=owner_id
            ),
            models.Property(
                title="Cozy 2-Bedroom Serviced Apartment in Wuse 2",
                description="Well-maintained, fully serviced apartment in Wuse 2. Enjoy 24/7 power, security, and proximity to major business hubs and recreational centers.",
                price=6000000,
                location="Abuja",
                type="Rent",
                category="Apartment",
                rental_period="Yearly",
                image_url="/properties/property-2.jpg",
                bedrooms=2,
                bathrooms=2,
                owner_id=owner_id
            ),
            models.Property(
                title="Exquisite Waterfront Villa in Banana Island",
                description="A breathtaking villa offering spectacular ocean views. This masterfully designed property includes a private pool, indoor cinema, and smart home integration.",
                price=850000000,
                location="Lagos",
                type="Buy",
                category="House",
                rental_period=None,
                image_url="/properties/property-1.jpg",
                bedrooms=5,
                bathrooms=6,
                owner_id=owner_id
            ),
            models.Property(
                title="Stylish Flat in Lekki Phase 1",
                description="Contemporary 3-bedroom flat in a secure estate in Lekki Phase 1. Features modern finishings and access to a central gym and swimming pool.",
                price=4500000,
                location="Lagos",
                type="Rent",
                category="Apartment",
                rental_period="Yearly",
                image_url="/properties/property-3.jpg",
                bedrooms=3,
                bathrooms=3,
                owner_id=owner_id
            ),
            models.Property(
                title="Premium Beach House in Ilashe",
                description="Luxurious private beach house perfect for weekend getaways and parties. Features a massive pool right softly touching the ocean breeze.",
                price=350000,
                location="Lagos",
                type="Rent",
                category="Beach House",
                rental_period="Daily",
                image_url="/properties/property-1.jpg",
                bedrooms=4,
                bathrooms=5,
                owner_id=owner_id
            ),
            models.Property(
                title="Spacious Shop in Garki Plaza",
                description="Prime location shop in the busy Garki commercial district. High foot traffic and excellent visibility for your retail business.",
                price=2500000,
                location="Abuja",
                type="Rent",
                category="Shop/Plaza",
                rental_period="Yearly",
                image_url="/properties/property-4.jpg",
                bedrooms=0,
                bathrooms=1,
                owner_id=owner_id
            ),
            models.Property(
                title="Grand Event Center Victoria Island",
                description="Spectacular 1000-seater capacity hall equipped with professional lighting, sound systems, and massive underground parking.",
                price=1500000,
                location="Lagos",
                type="Rent",
                category="Event Location",
                rental_period="Daily",
                image_url="/properties/property-2.jpg",
                bedrooms=0,
                bathrooms=4,
                owner_id=owner_id
            ),
            models.Property(
                title="Luxury Smart Airbnb in Wuse",
                description="Fully automated smart home with premium internet, Netflix, cleaning services, and an indoor jacuzzi. The ultimate shortlet experience.",
                price=85000,
                location="Abuja",
                type="Rent",
                category="Airbnb",
                rental_period="Daily",
                image_url="/properties/property-3.jpg",
                bedrooms=1,
                bathrooms=1,
                owner_id=owner_id
            )
        ]

        # Add to database
        print(f"Adding {len(properties_to_add)} new properties...")
        for prop in properties_to_add:
            db.add(prop)
        db.commit()
        print("Database seeded successfully with exactly 4 properties.")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
