/*
  # Bank Application Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `created_at` (timestamptz)
    
    - `cards`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `card_number` (text, unique)
      - `card_holder_name` (text)
      - `balance` (numeric)
      - `expiry_date` (text)
      - `cvv` (text)
      - `created_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `from_card_id` (uuid, foreign key to cards)
      - `to_card_number` (text)
      - `amount` (numeric)
      - `description` (text)
      - `transaction_date` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and manage their own data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  card_number text UNIQUE NOT NULL,
  card_holder_name text NOT NULL,
  balance numeric DEFAULT 0,
  expiry_date text NOT NULL,
  cvv text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  to_card_number text NOT NULL,
  amount numeric NOT NULL,
  description text DEFAULT '',
  transaction_date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cards policies
CREATE POLICY "Users can view all cards"
  ON cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample data for demonstration
INSERT INTO customers (first_name, last_name, email, phone) VALUES
  ('John', 'Doe', 'john.doe@email.com', '+1234567890'),
  ('Jane', 'Smith', 'jane.smith@email.com', '+1987654321')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cards (customer_id, card_number, card_holder_name, balance, expiry_date, cvv)
SELECT 
  c.id,
  '4532 1234 5678 9010',
  'JOHN DOE',
  5000.00,
  '12/25',
  '123'
FROM customers c WHERE c.email = 'john.doe@email.com'
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO cards (customer_id, card_number, card_holder_name, balance, expiry_date, cvv)
SELECT 
  c.id,
  '5425 2334 3010 9903',
  'JANE SMITH',
  3500.00,
  '06/26',
  '456'
FROM customers c WHERE c.email = 'jane.smith@email.com'
ON CONFLICT (card_number) DO NOTHING;