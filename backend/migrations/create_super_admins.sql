-- Create super_admins table
CREATE TABLE IF NOT EXISTS super_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default super admin
-- Default credentials: username=superadmin, password=SuperAdmin@123
INSERT INTO super_admins (username, password_hash, email) 
VALUES (
    'superadmin', 
    '$2b$10$rH8qXwZYGQZ5vY0YqZ5WCeFqZ5WCeFqZ5WCeFqZ5WCeFqZ5WCeFqZ',  -- This will be replaced with actual hash
    'superadmin@srpharmagical.com'
)
ON CONFLICT (username) DO NOTHING;

-- Output success message
SELECT 'Super admins table created successfully' as status;
