// Perguntas frequentes compartilhadas entre a landing, a página de Ajuda
// do paciente e o chat de suporte (bot). `keywords` ajuda o bot a casar o
// texto digitado com a resposta correta.

export interface Faq {
  q: string
  a: string
  keywords: string[]
}

export const FAQS: Faq[] = [
  {
    q: 'Cannabis medicinal é legal no Brasil?',
    a: 'Sim. O tratamento com cannabis medicinal é regulamentado pela Anvisa. Com a receita de um médico prescritor, você adquire produtos autorizados de forma 100% legal.',
    keywords: ['legal', 'lei', 'anvisa', 'regulament', 'permitido', 'cannabis', 'proibido'],
  },
  {
    q: 'Quais condições podem ser tratadas?',
    a: 'Insônia, ansiedade, dor crônica, epilepsia e outras condições. O médico avalia seu caso individualmente e indica o tratamento apenas quando for apropriado.',
    keywords: ['condi', 'trata', 'insônia', 'insonia', 'ansiedade', 'dor', 'epilepsia', 'serve', 'indica'],
  },
  {
    q: 'Preciso pagar antes de me cadastrar?',
    a: 'Não. Você pode finalizar o cadastro e pagar depois, direto na sua área. O médico só é acionado após a confirmação do pagamento.',
    keywords: ['pagar', 'pagamento', 'pagase', 'antes', 'cadastr', 'preço', 'preco', 'valor', 'custa'],
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Tratamos seus dados conforme a LGPD. Documentos e informações de saúde ficam visíveis apenas para os profissionais responsáveis pelo seu caso.',
    keywords: ['dados', 'seguro', 'segurança', 'seguranca', 'lgpd', 'privacidade', 'documento'],
  },
  {
    q: 'Como recebo minha receita e laudo?',
    a: 'Após a consulta e a validação administrativa, os documentos ficam disponíveis para download e impressão na sua área de paciente.',
    keywords: ['receber', 'recebo', 'receita', 'laudo', 'download', 'baixar', 'documento', 'impress'],
  },
]

export const SUPPORT_EMAIL = 'suporte@biosativa.com.br'
