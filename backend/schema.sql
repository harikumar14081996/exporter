-- Shahraj Exporter Database Schema
-- PostgreSQL Database Setup with Seed Data

-- Drop existing tables if they exist
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS stats_section CASCADE;
DROP TABLE IF EXISTS our_surgical_instruments CASCADE;
DROP TABLE IF EXISTS we_specialize_in CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS about_us CASCADE;
DROP TABLE IF EXISTS sliders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS super_admin_settings CASCADE;
DROP TABLE IF EXISTS super_admins CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- ============================================================================
-- AUTHENTICATION TABLES
-- ============================================================================

-- Admins Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Super Admins Table  
CREATE TABLE super_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Super Admin Settings Table
CREATE TABLE super_admin_settings (
    id SERIAL PRIMARY KEY,
    super_password_hash VARCHAR(255) NOT NULL,
    website_name VARCHAR(255) DEFAULT 'Shahraj Exporter',
    theme_color VARCHAR(7) DEFAULT '#0066cc',
    copyright_text VARCHAR(255) DEFAULT 'Shahraj Exporter. All Rights Reserved.',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PRODUCT & CATEGORY TABLES
-- ============================================================================

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTENT MANAGEMENT TABLES
-- ============================================================================

-- Sliders Table (Hero Section)
CREATE TABLE sliders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT,
    cta_text VARCHAR(100),
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About Us Table
CREATE TABLE about_us (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Info Table
CREATE TABLE contact_info (
    id SERIAL PRIMARY KEY,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    business_hours TEXT,
    map_embed TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- We Specialize In Table
CREATE TABLE we_specialize_in (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT
);

-- Our Surgical Instruments Table
CREATE TABLE our_surgical_instruments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    icon VARCHAR(50)
);

-- Stats Section Table
CREATE TABLE stats_section (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value INTEGER NOT NULL,
    suffix VARCHAR(10),
    icon VARCHAR(50)
);

-- ============================================================================
-- USER INTERACTION TABLES
-- ============================================================================

-- Quotes Table (Quote Requests)
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    product_interest VARCHAR(255),
    quantity VARCHAR(100),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_sliders_position ON sliders(position);
CREATE INDEX idx_sliders_active ON sliders(is_active);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at);

-- ============================================================================
-- SEED DATA - Migrated from Static React Content
-- ============================================================================

-- Insert Default Super Admin Settings
-- Password: SuperAdmin@123 (hashed with bcrypt)
INSERT INTO super_admin_settings (super_password_hash, website_name, theme_color, copyright_text)
VALUES ('$2b$10$iz3EzbHcUs9u0PQmUVe5vekb7wo5.GKqcRT2AGpEHrqSe2VmxrQrS', 'Shahraj Exporter', '#0066cc', 'Shahraj Exporter. All Rights Reserved.');

-- Default admin (username: admin, password: admin123)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2b$10$cVIGESlvPZc0HQiH9bsbBeATaJYxYD.jOB9uYP49PV0Dg.k64aicW');

-- Default super admin (username: superadmin, password: SuperAdmin@123)
INSERT INTO super_admins (username, password_hash, email)
VALUES ('superadmin', '$2b$10$xEFZU5dbkXZTJXDjtOuLEOOLzCE67OsoCw7p8NjILoejVyBh73oQe', 'superadmin@shahrajexporter.com');

-- Insert Categories (from HomePage.tsx products array)
INSERT INTO categories (name) VALUES
('Cutting Instruments'),
('Surgical Blades'),
('Retraction Tools'),
('Suturing Equipment'),
('Hemostatic Instruments');

-- Insert Products (from HomePage.tsx)
INSERT INTO products (category_id, name, description, icon, is_active) VALUES
(1, 'Surgical Scissors & Forceps', 'Precision surgical scissors and forceps for delicate surgical procedures. Premium stainless steel construction.', '✂️', true),
(2, 'Scalpels & Blades', 'High-grade surgical scalpels and replacement blades. Superior sharpness and control.', '🔪', true),
(3, 'Retractors & Spreaders', 'Self-retaining and handheld retractors for optimal surgical exposure and access.', '🔧', true),
(4, 'Needle Holders & Sutures', 'Precision needle holders and surgical suture materials for secure wound closure.', '📌', true),
(5, 'Clamps & Hemostats', 'Surgical clamps and hemostatic forceps for controlling bleeding and tissue manipulation.', '🔒', true);

-- Insert Sliders (from ImageSlider.tsx)
INSERT INTO sliders (title, subtitle, description, image_url, cta_text, position, is_active) VALUES
('Excellence in Surgical Instruments', 'Shahraj Exporter', 'Your trusted partner for premium quality surgical instruments worldwide', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccf?w=1920&q=80', 'Explore Products', 1, true),
('Precision Engineering for Medical Excellence', 'Medical Grade Quality', 'ISO certified surgical instruments manufactured to the highest international standards', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80', 'Learn More', 2, true),
('Global Trust, Local Service', 'Exporting to 70+ Countries', 'Delivering premium surgical instruments to healthcare professionals worldwide', 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80', 'Contact Us', 3, true);

-- Insert We Specialize In Items (from HomePage.tsx specializations array)
INSERT INTO we_specialize_in (title) VALUES
('Surgical Scissors & Forceps'),
('Scalpels & Replacement Blades'),
('Retractors & Surgical Spreaders'),
('Needle Holders & Suture Materials'),
('Clamps & Hemostatic Forceps'),
('Orthopedic Surgical Instruments'),
('Diagnostic & Examination Tools'),
('Dental Surgery Instruments'),
('Ophthalmic Surgical Instruments');

-- Insert Our Surgical Instruments (same data as products for showcase section)
INSERT INTO our_surgical_instruments (name, description, icon) VALUES
('Surgical Scissors & Forceps', 'Precision surgical scissors and forceps for delicate surgical procedures. Premium stainless steel construction.', '✂️'),
('Scalpels & Blades', 'High-grade surgical scalpels and replacement blades. Superior sharpness and control.', '🔪'),
('Retractors & Spreaders', 'Self-retaining and handheld retractors for optimal surgical exposure and access.', '🔧'),
('Needle Holders & Sutures', 'Precision needle holders and surgical suture materials for secure wound closure.', '📌'),
('Clamps & Hemostats', 'Surgical clamps and hemostatic forceps for controlling bleeding and tissue manipulation.', '🔒'),
('Orthopedic Instruments', 'Specialized instruments for orthopedic surgery including bone saws, drills, and fixation tools.', '🦴');

-- Insert Stats Section (from Stats.tsx)
INSERT INTO stats_section (label, value, suffix, icon) VALUES
('Countries Served', 70, '+', '🌍'),
('Products', 5000, '+', '⚕️'),
('Quality Assurance', 100, '%', '✓'),
('Years Experience', 25, '+', '⭐');

-- Insert About Us Content (from AboutPage.tsx)
INSERT INTO about_us (content) VALUES
('{"story": "Shahraj Exporter has been a trusted name in surgical instruments manufacturing and export for years. We combine precision engineering with medical-grade quality standards to deliver instruments that medical professionals worldwide depend on.\n\nOur journey began with a vision to provide healthcare professionals with surgical instruments that meet the highest international standards. Today, we export to over 70 countries and serve thousands of hospitals, clinics, and medical institutions globally.\n\nWe take pride in our commitment to quality, innovation, and customer satisfaction. Every instrument that leaves our facility undergoes rigorous quality control to ensure it meets our exacting standards.", "values": [{"icon": "⚙️", "title": "Precision Engineering", "description": "Advanced manufacturing techniques ensure every instrument meets exact specifications with superior quality."}, {"icon": "✅", "title": "Quality Certified", "description": "ISO 9001, CE marked, and FDA approved products that comply with international medical standards."}, {"icon": "🌍", "title": "Global Presence", "description": "Exporting to 70+ countries with a strong distribution network and satisfied customers worldwide."}, {"icon": "🔬", "title": "Medical Grade Materials", "description": "Premium stainless steel and titanium instruments that ensure durability and sterility."}, {"icon": "🎯", "title": "Customer Focus", "description": "Dedicated to understanding and meeting the unique needs of healthcare professionals."}, {"icon": "🚀", "title": "Continuous Innovation", "description": "Investing in research and development to create next-generation surgical instruments."}], "whyChoose": [{"title": "25+ Years of Experience", "description": "Decades of expertise in surgical instrument manufacturing and global distribution."}, {"title": "5000+ Product Range", "description": "Comprehensive catalog covering all surgical specialties and medical disciplines."}, {"title": "100% Quality Assurance", "description": "Every instrument undergoes multiple quality checks before delivery."}, {"title": "Competitive Pricing", "description": "Best value for premium quality instruments without compromising standards."}, {"title": "Timely Delivery", "description": "Efficient logistics and shipping to ensure your orders arrive on schedule."}, {"title": "Expert Support", "description": "Technical assistance and customer service from knowledgeable professionals."}]}');

-- Insert Contact Info (from ContactPage.tsx and Footer.tsx)
INSERT INTO contact_info (address, phone, email, business_hours) VALUES
('India', '+91-XXXXXXXXXX', 'info@shahrajexporter.com', 'Monday - Saturday: 9:00 AM - 6:00 PM');

-- ============================================================================
-- FUNCTION TO ENFORCE 5 PRODUCT LIMIT PER CATEGORY
-- ============================================================================

CREATE OR REPLACE FUNCTION check_products_per_category()
RETURNS TRIGGER AS $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE category_id = NEW.category_id AND is_active = true;
    
    IF product_count >= 5 THEN
        RAISE EXCEPTION 'Cannot add more than 5 products per category without super admin approval';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for product limit (can be disabled for super admin operations)
CREATE TRIGGER enforce_product_limit
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_products_per_category();

-- Category limit: max 5 categories
CREATE OR REPLACE FUNCTION check_category_limit()
RETURNS TRIGGER AS $$
DECLARE
    category_count integer;
BEGIN
    SELECT COUNT(*) INTO category_count FROM categories;
    IF category_count >= 5 THEN
        RAISE EXCEPTION 'Cannot add more than 5 categories';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_category_limit
    BEFORE INSERT ON categories
    FOR EACH ROW
    EXECUTE FUNCTION check_category_limit();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify seed data counts
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'sliders', COUNT(*) FROM sliders
UNION ALL
SELECT 'we_specialize_in', COUNT(*) FROM we_specialize_in
UNION ALL
SELECT 'our_surgical_instruments', COUNT(*) FROM our_surgical_instruments
UNION ALL
SELECT 'stats_section', COUNT(*) FROM stats_section
UNION ALL
SELECT 'about_us', COUNT(*) FROM about_us
UNION ALL
SELECT 'contact_info', COUNT(*) FROM contact_info;
