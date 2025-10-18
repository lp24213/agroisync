-- Adicionar campos completos do veículo na tabela freight (estilo FreteBrás)

-- Marca do veículo
ALTER TABLE freight ADD COLUMN vehicle_brand TEXT;

-- Ano de fabricação
ALTER TABLE freight ADD COLUMN vehicle_year INTEGER;

-- Cor do veículo
ALTER TABLE freight ADD COLUMN vehicle_color TEXT;

-- Tipo de carroceria (baú, sider, graneleiro, etc)
ALTER TABLE freight ADD COLUMN vehicle_body_type TEXT;

-- Número de eixos
ALTER TABLE freight ADD COLUMN vehicle_axles INTEGER;

-- Número do chassi
ALTER TABLE freight ADD COLUMN chassis_number TEXT;

-- RENAVAM
ALTER TABLE freight ADD COLUMN renavam TEXT;

-- Registro ANTT
ALTER TABLE freight ADD COLUMN antt TEXT;

-- CRLV (documento do veículo)
ALTER TABLE freight ADD COLUMN crlv TEXT;

-- Comentário
-- Todos os campos adicionados para formulário completo de frete estilo FreteBrás

