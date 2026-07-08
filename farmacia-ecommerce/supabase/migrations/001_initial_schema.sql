-- Farmácia Ecommerce — schema inicial
-- Ver CLAUDE.md para o contrato completo de arquitetura.
-- Ainda não aplicado a nenhum projeto Supabase — parte do roadmap.

-- Usuários (complementa auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer','admin')),
  cpf TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catálogo
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active_ingredient TEXT NOT NULL,
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  controlled_class TEXT NOT NULL CHECK (controlled_class IN ('V','A','L')), -- tarja vermelha/amarela/venda livre
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  requires_report BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- ex.: PED-000123
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'aguardando_docs'
    CHECK (status IN (
      'aguardando_docs','em_analise','aprovado',
      'em_separacao','enviado','entregue','recusado'
    )),
  total_cents INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'pix',
  shipping_address JSONB NOT NULL DEFAULT '{}', -- snapshot do endereço no momento da compra
  tracking_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido (snapshot de nome/preço no momento da compra)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0)
);

-- Histórico de status (equivalente ao "track" do protótipo)
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos (receita, laudo, identidade)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('prescription','medical_report','identity')),
  filename TEXT,
  storage_path TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  validated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transações de pagamento
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  reference_id TEXT UNIQUE,
  amount_cents INTEGER,
  method TEXT,
  status TEXT DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(status);
CREATE INDEX ON order_items(order_id);
CREATE INDEX ON order_status_history(order_id);
CREATE INDEX ON documents(user_id);
CREATE INDEX ON documents(order_id);
CREATE INDEX ON payment_transactions(reference_id);

-- RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Cliente vê só os próprios pedidos/documentos
CREATE POLICY "customer_own_orders" ON orders
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "customer_own_order_items" ON order_items
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "customer_own_history" ON order_status_history
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "customer_own_documents" ON documents
  FOR ALL USING (user_id = auth.uid());

-- products é público para leitura (catálogo); escrita só via service role
CREATE POLICY "products_public_read" ON products FOR SELECT USING (active = TRUE);

-- Service role bypassa RLS (para API routes com service_role_key) — usado pelo admin

-- updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_orders BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_payment_transactions BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-cria profiles ao criar um usuário no Supabase Auth
-- (lê name/role de raw_user_meta_data, igual ao sua-logo)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Cliente'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
