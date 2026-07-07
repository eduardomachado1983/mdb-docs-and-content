-- Adiciona o tipo de documento "previous_consultation" (consultas
-- anteriores/exames), enviado opcionalmente na etapa de Consulta do
-- cadastro, além dos já existentes "identity" e "address".

ALTER TABLE documents DROP CONSTRAINT documents_type_check;
ALTER TABLE documents ADD CONSTRAINT documents_type_check
  CHECK (type IN ('identity', 'address', 'previous_consultation'));
