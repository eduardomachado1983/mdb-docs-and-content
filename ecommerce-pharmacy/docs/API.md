# 📚 Documentação da API REST

**Base URL**: `https://api.pharmacy.local/api`  
**Versão**: v1  
**Autenticação**: Bearer Token (JWT)

## 🔑 Autenticação

Todos os endpoints (exceto auth) requerem header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### POST `/auth/register`
Registra novo usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "João Silva",
  "cpf": "12345678901",
  "phone": "11999999999",
  "dateOfBirth": "1990-01-15"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "João Silva",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### POST `/auth/login`
Faz login e retorna JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "João Silva"
  }
}
```

### POST `/auth/refresh`
Renova JWT usando refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### POST `/auth/logout`
Logout do usuário.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 Usuários

### GET `/users/me`
Obtém dados do usuário autenticado.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "João Silva",
  "cpf": "12345678901",
  "phone": "11999999999",
  "dateOfBirth": "1990-01-15",
  "address": {
    "street": "Rua A",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "01234-567"
  },
  "createdAt": "2026-06-25T10:30:00Z",
  "updatedAt": "2026-06-25T10:30:00Z"
}
```

### PUT `/users/me`
Atualiza dados do usuário.

**Request:**
```json
{
  "fullName": "João da Silva",
  "phone": "11888888888",
  "address": {
    "street": "Rua B",
    "number": "456",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "02345-678"
  }
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "João da Silva",
  "phone": "11888888888",
  "address": {...},
  "updatedAt": "2026-06-25T11:00:00Z"
}
```

### PUT `/users/me/password`
Altera senha do usuário.

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

## 💊 Medicamentos

### GET `/products`
Lista medicamentos com paginação e filtros.

**Query Parameters:**
```
?page=1&limit=20&search=Dipirona&active_ingredient=paracetamol&sort=name
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Dipirona 500mg",
      "description": "Analgésico e antitérmico",
      "activeIngredient": "dipirona",
      "dosage": "500mg",
      "requiresPrescription": false,
      "requiresMedicalReport": false,
      "price": 15.50,
      "stock": 100,
      "manufacturer": "Laboratório X",
      "sku": "DIP-500-001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13
  }
}
```

### GET `/products/:id`
Obtém detalhe de um medicamento.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Dipirona 500mg",
  "description": "Analgésico e antitérmico",
  "activeIngredient": "dipirona",
  "dosage": "500mg",
  "requiresPrescription": false,
  "requiresMedicalReport": false,
  "price": 15.50,
  "stock": 100,
  "manufacturer": "Laboratório X",
  "sku": "DIP-500-001",
  "sideEffects": "Tontura, cefaleia",
  "contraindications": "Alergia à dipirona",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## 📄 Documentos Médicos

### GET `/documents`
Lista documentos do usuário autenticado.

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "documentType": "PRESCRIPTION",
      "fileUrl": "https://s3.amazonaws.com/...",
      "validationStatus": "APPROVED",
      "validatedAt": "2026-06-24T15:00:00Z",
      "expiresAt": "2026-09-24T15:00:00Z",
      "createdAt": "2026-06-20T10:00:00Z"
    }
  ]
}
```

### POST `/documents/upload`
Faz upload de documento médico (multipart/form-data).

**Request:**
```
Content-Type: multipart/form-data

documentType: PRESCRIPTION
file: <binary PDF file>
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "documentType": "PRESCRIPTION",
  "fileUrl": "https://s3.amazonaws.com/...",
  "validationStatus": "PENDING",
  "createdAt": "2026-06-25T10:00:00Z",
  "message": "Document uploaded successfully. Admin validation pending."
}
```

### GET `/documents/:id`
Obtém detalhe de um documento.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "documentType": "PRESCRIPTION",
  "fileUrl": "https://s3.amazonaws.com/...",
  "validationStatus": "APPROVED",
  "extractedData": {
    "physicianName": "Dr. João",
    "physicianCRM": "12345",
    "medications": ["Dipirona 500mg"],
    "issueDate": "2026-06-20"
  },
  "validatedBy": "admin@example.com",
  "validatedAt": "2026-06-24T15:00:00Z",
  "expiresAt": "2026-09-24T15:00:00Z",
  "createdAt": "2026-06-20T10:00:00Z"
}
```

### DELETE `/documents/:id`
Deleta um documento do usuário.

**Response (204):** No content

---

## 🛒 Carrinho

### GET `/cart`
Obtém carrinho do usuário.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "items": [
    {
      "medicationId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Dipirona 500mg",
      "price": 15.50,
      "quantity": 2,
      "subtotal": 31.00
    }
  ],
  "totalItems": 2,
  "totalPrice": 31.00,
  "updatedAt": "2026-06-25T10:30:00Z"
}
```

### POST `/cart/add`
Adiciona medicamento ao carrinho.

**Request:**
```json
{
  "medicationId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "message": "Product added to cart",
  "cart": {
    "totalItems": 2,
    "totalPrice": 31.00
  }
}
```

### PUT `/cart/update/:medicationId`
Atualiza quantidade de um item.

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "message": "Cart updated",
  "cart": {...}
}
```

### DELETE `/cart/remove/:medicationId`
Remove item do carrinho.

**Response (204):** No content

### POST `/cart/clear`
Limpa o carrinho.

**Response (200):**
```json
{
  "message": "Cart cleared"
}
```

---

## 📦 Pedidos

### POST `/orders`
Cria novo pedido.

**Request:**
```json
{
  "prescriptionId": "550e8400-e29b-41d4-a716-446655440002",
  "medicalReportId": "550e8400-e29b-41d4-a716-446655440005",
  "shippingAddress": {
    "street": "Rua A",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "01234-567"
  }
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440006",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "medicationId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "priceAtTime": 15.50
    }
  ],
  "totalPrice": 31.00,
  "status": "PAYMENT_PENDING",
  "paymentId": "550e8400-e29b-41d4-a716-446655440007",
  "createdAt": "2026-06-25T10:30:00Z"
}
```

### GET `/orders`
Lista pedidos do usuário.

**Query Parameters:**
```
?page=1&limit=10&status=DELIVERED&sort=-createdAt
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440006",
      "totalPrice": 31.00,
      "status": "DELIVERED",
      "trackingNumber": "BR123456789BR",
      "createdAt": "2026-06-25T10:30:00Z",
      "updatedAt": "2026-06-27T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### GET `/orders/:id`
Obtém detalhe do pedido.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440006",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "medicationId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Dipirona 500mg",
      "quantity": 2,
      "priceAtTime": 15.50,
      "subtotal": 31.00
    }
  ],
  "totalPrice": 31.00,
  "status": "DELIVERED",
  "shippingAddress": {...},
  "trackingNumber": "BR123456789BR",
  "prescriptionId": "550e8400-e29b-41d4-a716-446655440002",
  "medicalReportId": "550e8400-e29b-41d4-a716-446655440005",
  "createdAt": "2026-06-25T10:30:00Z",
  "updatedAt": "2026-06-27T14:00:00Z"
}
```

### POST `/orders/:id/cancel`
Cancela um pedido.

**Request:**
```json
{
  "reason": "Medicamento indisponível"
}
```

**Response (200):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "status": "CANCELLED"
  }
}
```

---

## 💳 Pagamentos

### POST `/payments/:orderId`
Processa pagamento para um pedido.

**Request:**
```json
{
  "paymentMethod": "CREDIT_CARD",
  "cardData": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123",
    "holderName": "João Silva"
  }
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440007",
  "orderId": "550e8400-e29b-41d4-a716-446655440006",
  "amount": 31.00,
  "status": "AUTHORIZED",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "tx_123456789",
  "message": "Payment authorized. Waiting for document validation."
}
```

### GET `/payments/:paymentId`
Obtém status do pagamento.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440007",
  "orderId": "550e8400-e29b-41d4-a716-446655440006",
  "amount": 31.00,
  "status": "CAPTURED",
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "tx_123456789",
  "createdAt": "2026-06-25T10:30:00Z",
  "updatedAt": "2026-06-25T11:00:00Z"
}
```

---

## ⚙️ Admin Endpoints

### GET `/admin/documents`
Lista documentos pendentes de validação.

**Query Parameters:**
```
?page=1&limit=20&status=PENDING&sort=-createdAt
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "documentType": "PRESCRIPTION",
      "fileUrl": "https://s3.amazonaws.com/...",
      "validationStatus": "PENDING",
      "createdAt": "2026-06-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### PUT `/admin/documents/:id/approve`
Aprova um documento.

**Request:**
```json
{
  "notes": "Receita válida, médico verificado",
  "expiresIn": 90
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "validationStatus": "APPROVED",
  "validatedAt": "2026-06-25T11:00:00Z",
  "expiresAt": "2026-09-25T11:00:00Z"
}
```

### PUT `/admin/documents/:id/reject`
Rejeita um documento.

**Request:**
```json
{
  "reason": "Receita ilegível ou incompleta"
}
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "validationStatus": "REJECTED",
  "validatedAt": "2026-06-25T11:00:00Z",
  "rejectionReason": "Receita ilegível ou incompleta"
}
```

---

## 🔄 Webhooks (Opcional)

### POST `/webhooks/payment`
Webhook para confirmação de pagamento.

**Event:** `payment.completed`
```json
{
  "event": "payment.completed",
  "paymentId": "550e8400-e29b-41d4-a716-446655440007",
  "orderId": "550e8400-e29b-41d4-a716-446655440006",
  "status": "CAPTURED",
  "timestamp": "2026-06-25T11:00:00Z"
}
```

---

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente ou inválido |
| 403 | Forbidden - Sem permissão para acessar |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe (ex: email duplicado) |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error |

**Exemplo de resposta de erro:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

**Última atualização**: 2026-06-25  
**Versão da API**: v1.0
