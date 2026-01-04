-- Insert sample items
INSERT INTO items (title, description, category, location, date, contact_info, status) VALUES
('Blue Backpack', 'Lost a blue backpack with laptop inside near the library', 'lost', 'Central Library, Main Street', '2025-01-15', 'john@example.com', 'active'),
('Gold Wedding Ring', 'Found a gold wedding ring with initials "M&J" engraved', 'found', 'City Park, near fountain', '2025-01-18', 'sarah@example.com', 'active'),
('Mountain Bike', 'Stolen red mountain bike, Trek brand, serial #12345', 'stolen', '5th Avenue Apartments', '2025-01-10', 'mike@example.com', 'active'),
('Black Wallet', 'Found black leather wallet with ID cards', 'found', 'Coffee Shop on Oak Street', '2025-01-20', 'emma@example.com', 'active'),
('Silver Necklace', 'Lost silver necklace with heart pendant', 'lost', 'Downtown Shopping Mall', '2025-01-12', 'lisa@example.com', 'resolved');

-- Insert sample comments
INSERT INTO comments (item_id, author_name, comment_text) VALUES
(1, 'Jane Doe', 'I think I saw this backpack at the lost and found desk!'),
(1, 'Admin', 'Please check with the library staff at the main desk.'),
(2, 'Michael', 'Is there any other identifying information on the ring?'),
(3, 'Officer Smith', 'Please file a police report and provide the case number.'),
(4, 'David', 'I lost my wallet there! Could this be mine?');
