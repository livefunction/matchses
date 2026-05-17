-- ============================================
-- MATCHS Database Schema (MySQL 8.0+)
-- 実行: mysql -u user -p matchses_db < sql/init.sql
-- ============================================

CREATE TABLE IF NOT EXISTS experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_ja VARCHAR(255),
    description_en TEXT,
    description_ja TEXT,
    duration VARCHAR(50),
    location VARCHAR(100),
    price_per_person INT NOT NULL,
    max_guests INT DEFAULT 10,
    category ENUM('food','nature','onsen','family','nightlife','culture'),
    image_hero VARCHAR(255),
    image_gallery JSON,
    whats_included JSON,
    schedule JSON,
    rating DECIMAL(2,1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    cancellation_policy VARCHAR(255) DEFAULT 'Free cancellation up to 24 hours before',
    stripe_price_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hosts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    location VARCHAR(100),
    bio_en TEXT,
    quote VARCHAR(255),
    years_experience VARCHAR(50),
    specialties JSON,
    image_gradient VARCHAR(50),
    rating DECIMAL(2,1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    residency_years VARCHAR(50),
    interests JSON,
    energy_style ENUM('talkative','balanced','quiet') DEFAULT 'balanced',
    perfect_for JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS experience_hosts (
    experience_id INT NOT NULL,
    host_id INT NOT NULL,
    PRIMARY KEY (experience_id, host_id),
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    FOREIGN KEY (host_id) REFERENCES hosts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    experience_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_whatsapp VARCHAR(50),
    booking_date DATE NOT NULL,
    guest_count INT NOT NULL,
    total_amount INT NOT NULL,
    stripe_session_id VARCHAR(255),
    stripe_payment_status ENUM('unpaid','paid','cancelled') DEFAULT 'unpaid',
    status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id),
    INDEX idx_session (stripe_session_id),
    INDEX idx_status (status),
    INDEX idx_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    amount INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'jpy',
    status VARCHAR(50),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_session (stripe_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS merchants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    listing_type ENUM('standard','premium','featured') DEFAULT 'standard',
    stripe_subscription_id VARCHAR(100),
    subscription_status ENUM('active','cancelled','past_due') DEFAULT 'active',
    monthly_fee INT DEFAULT 9800,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO experiences (slug, title_en, title_ja, description_en, duration, location, price_per_person, max_guests, category, image_hero, whats_included, schedule, rating, review_count) VALUES
('mt-takao-local-food-tour', 'Mt. Takao Local Food Tour', '高尾山ローカルフードツアー',
 'Explore the sacred mountain with a local guide. Taste traditional soba, mountain yam, and seasonal snacks. Perfect for first-time visitors.',
 '3 Hours', 'Tokyo Tama', 4980, 8, 'food', '/images/experiences/takao-food.jpg',
 '["English-speaking guide","3 food tastings","Round-trip cable car ticket","Seasonal snacks","Water"]',
 '[{"time":"09:00","activity":"Meet at Takaosanguchi Station"},{"time":"09:30","activity":"Cable car to middle"},{"time":"10:00","activity":"Forest walk & temple visit"},{"time":"12:00","activity":"Lunch at local soba restaurant"}]', 4.8, 32),

('best-izakaya-tachikawa', 'Best Izakaya in Tachikawa', '立川ベスト居酒屋ツアー',
 'Experience Japanese bar culture with a local. 5 dishes + 90min free-flow drinks. Visit 3 hidden izakayas tourists never find.',
 '2.5 Hours', 'Tokyo Tachikawa', 6500, 6, 'nightlife', '/images/experiences/izakaya-tachikawa.jpg',
 '["5 dishes per person","90min free drink","English-speaking guide","3 izakaya visits"]',
 '[{"time":"18:00","activity":"Meet at Tachikawa Station"},{"time":"18:15","activity":"First izakaya: standing bar"},{"time":"19:00","activity":"Second izakaya: local favorite"},{"time":"19:45","activity":"Third izakaya: hidden gem"}]', 4.9, 47),

('onsen-day-trip-tama', 'Onsen Day Trip in Tama', '多摩日帰り温泉トリップ',
 'Soak in natural hot springs surrounded by forest. Traditional Japanese set meal included. Perfect relaxation away from crowds.',
 '4 Hours', 'Tokyo Tama', 3800, 10, 'onsen', '/images/experiences/onsen-tama.jpg',
 '["Onsen entry ticket","Traditional set meal","Towel rental","English guide","Private bath: +1500"]',
 '[{"time":"10:00","activity":"Meet at Tama Station"},{"time":"10:30","activity":"Arrive at onsen"},{"time":"12:30","activity":"Traditional lunch"},{"time":"13:30","activity":"Free time"}]', 4.7, 28);

INSERT INTO hosts (name, role, location, bio_en, quote, years_experience, specialties, image_gradient, rating, review_count, residency_years, energy_style, perfect_for) VALUES
('Hiroshi Yamamoto', 'Former Sushi Chef & Food Guide', 'Hachioji, Tokyo',
 'After 25 years as a sushi chef in Tokyo, I returned to my hometown to share the food culture I grew up with. I know every hidden restaurant and every story behind the dishes.',
 '"The best meal is the one shared with locals who know where to go."',
 '25+ years', '["Local cuisine","Sushi history","Sake pairing","Market tours"]',
 'linear-gradient(135deg, #F97316, #EF4444)', 4.9, 127, '45 years', 'talkative',
 '["Food enthusiasts","First-time visitors","Small groups","Cultural explorers"]'),

('Yuki Tanaka', 'Wellness Coach & Onsen Expert', 'Ome, Tokyo',
 'Certified onsen sommelier and wellness coach. I know exactly which onsen fits your mood and will guide you to the perfect bath.',
 '"Let the hot springs wash away your fatigue and open your heart to Japan."',
 '12+ years', '["Onsen culture","Wellness","Japanese etiquette","Nature walks"]',
 'linear-gradient(135deg, #06B6D4, #3B82F6)', 5.0, 89, '38 years', 'balanced',
 '["Wellness seekers","Couples","Nature lovers","Solo travelers"]'),

('Kenji Watanabe', 'Nature Guide & Forest Therapist', 'Takao, Tokyo',
 'I have been exploring Mt. Takao forests since childhood. I can identify 200+ plant species and know where to spot wildlife.',
 '"The forest has stories to tell. Let me be your translator."',
 '15+ years', '["Forest hiking","Wildlife spotting","Photography"]',
 'linear-gradient(135deg, #10B981, #059669)', 4.8, 103, '42 years', 'quiet',
 '["Nature photographers","Hiking enthusiasts","Solo adventurers","Families"]');

INSERT INTO experience_hosts (experience_id, host_id) VALUES
(1, 1), (1, 3), (2, 1), (3, 2);
