-- Insert sample data (optional)
INSERT INTO users (email, password, name) VALUES 
('demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIpu', 'Demo User')
ON CONFLICT (email) DO NOTHING;