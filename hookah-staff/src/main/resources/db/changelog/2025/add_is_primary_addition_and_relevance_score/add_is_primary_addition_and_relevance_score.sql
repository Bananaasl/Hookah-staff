ALTER TABLE tobacco
ADD COLUMN is_primary_addition BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN relevance_score DECIMAL(3,1) NOT NULL DEFAULT 1.0,
ADD COLUMN last_relevance_update TIMESTAMP;

CREATE INDEX idx_tobacco_brand_taste ON tobacco(brand_name, taste);
CREATE INDEX idx_tobacco_primary ON tobacco(is_primary_addition);
CREATE INDEX idx_tobacco_relevance ON tobacco(relevance_score);
CREATE INDEX idx_tobacco_brand_taste_weight_price ON tobacco(brand_name, taste, weight, price);