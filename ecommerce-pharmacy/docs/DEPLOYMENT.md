# 🚀 Guia de Deployment

Instruções completas para fazer deploy da plataforma em diferentes ambientes.

## 📋 Índice

- [Ambientes](#ambientes)
- [Pré-requisitos](#pré-requisitos)
- [Deploy em Staging](#deploy-em-staging)
- [Deploy em Produção](#deploy-em-produção)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

---

## Ambientes

### Desenvolvimento (Local)
- **URL**: http://localhost:3001
- **BD**: PostgreSQL local
- **Auth**: JWT básico
- **Deploy**: `docker-compose up`

### Staging
- **URL**: https://staging.pharmacy.local
- **BD**: PostgreSQL gerenciado
- **Auth**: JWT + 2FA
- **Deploy**: CI/CD automático (GitHub Actions)
- **Monitoramento**: Prometheus + Grafana
- **Backup**: Diário

### Produção
- **URL**: https://pharmacy.com
- **BD**: PostgreSQL gerenciado com replicação
- **Auth**: JWT + 2FA obrigatório
- **Deploy**: Manual após aprovação
- **Monitoramento**: DataDog/NewRelic
- **Backup**: Contínuo + 30 dias retenção

---

## Pré-requisitos

### Ferramentas Necessárias
```bash
# macOS
brew install docker docker-compose kubectl helm
brew install aws-cli

# Ubuntu
sudo apt-get install docker.io docker-compose kubectl
snap install aws-cli

# Windows
# Instale Docker Desktop: https://www.docker.com/products/docker-desktop
```

### Configuração AWS

```bash
# Configure credenciais AWS
aws configure

# Verificar acesso
aws s3 ls
aws rds describe-db-instances
```

### Variáveis de Ambiente

Crie um arquivo `.env.production`:
```bash
cp backend/.env.example backend/.env.production
cp frontend/.env.example frontend/.env.production
```

Edite com valores de produção.

---

## Deploy em Staging

### Via GitHub Actions (Automático)

Simplesmente faça push para a branch `staging`:

```bash
git push origin feature/my-feature
# Crie um PR
# Após aprovação e merge em staging, o deploy automático começa
```

**Pipeline:**
1. Build do Docker
2. Testes (unit + integration + e2e)
3. Análise de código (ESLint, TypeScript)
4. Push de imagens para Docker Registry
5. Deploy em ECS/Kubernetes
6. Smoke tests
7. Notificação no Slack

### Via Deploy Manual

Se precisar fazer deploy manual:

```bash
# 1. Compilar aplicações
docker build -t ecommerce-pharmacy-backend:staging ./backend
docker build -t ecommerce-pharmacy-frontend:staging ./frontend

# 2. Push para registry
docker push ecommerce-pharmacy-backend:staging
docker push ecommerce-pharmacy-frontend:staging

# 3. Deploy com kubectl
kubectl set image deployment/ecommerce-backend \
  backend=ecommerce-pharmacy-backend:staging \
  -n staging

kubectl set image deployment/ecommerce-frontend \
  frontend=ecommerce-pharmacy-frontend:staging \
  -n staging

# 4. Verificar rollout
kubectl rollout status deployment/ecommerce-backend -n staging
```

### Verificação Pós-Deploy

```bash
# Verificar health
curl https://staging.pharmacy.local/api/health

# Ver logs
kubectl logs -f deployment/ecommerce-backend -n staging
kubectl logs -f deployment/ecommerce-frontend -n staging

# Executar smoke tests
npm run test:e2e -- --base-url https://staging.pharmacy.local
```

---

## Deploy em Produção

### Checklist Pré-Deploy

- [ ] Todos os testes passam
- [ ] Code review aprovado
- [ ] Database migration testada em staging
- [ ] Documentação atualizada
- [ ] Release notes preparadas
- [ ] Rollback plan documentado
- [ ] Notificação ao time enviada
- [ ] Downtime planejado (se necessário)

### Processo de Deploy

#### 1. Criar Release
```bash
# Git tag
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Isso dispara o pipeline de release no GitHub Actions
# que gera artifacts e cria uma GitHub Release
```

#### 2. Aprovação Manual
O pipeline aguarda aprovação manual em:
```
https://github.com/your-repo/actions/runs/{run-id}
```

Clique em "Review deployments" e aprove.

#### 3. Build e Push
```bash
# GitHub Actions fará:
docker build -t ecommerce-pharmacy-backend:v1.2.0 ./backend
docker push ecommerce-pharmacy-backend:v1.2.0

# Criar image tag "latest"
docker tag ecommerce-pharmacy-backend:v1.2.0 ecommerce-pharmacy-backend:latest
docker push ecommerce-pharmacy-backend:latest
```

#### 4. Database Migrations
```bash
# Rodar migrações (deve ser idempotente)
kubectl run migration-job \
  --image=ecommerce-pharmacy-backend:v1.2.0 \
  --entrypoint npm \
  --rm \
  -i \
  -- \
  run migration:run \
  -n production
```

#### 5. Atualizar Deployments
```bash
# Blue-Green Deployment
kubectl set image deployment/ecommerce-backend-green \
  backend=ecommerce-pharmacy-backend:v1.2.0 \
  -n production

# Aguardar rollout
kubectl rollout status deployment/ecommerce-backend-green -n production

# Testar
curl https://pharmacy.com/api/health

# Alternar tráfego
kubectl patch service ecommerce-backend \
  -p '{"spec":{"selector":{"version":"green"}}}' \
  -n production
```

#### 6. Monitoramento
```bash
# Verificar métricas
# DataDog: https://app.datadoghq.com/dashboard

# Alertas ativados
# Verificar Slack: #production-alerts

# Logs
kubectl logs -f deployment/ecommerce-backend-green -n production
```

---

## Rollback

Se algo der errado durante o deploy:

### Rollback Automático
```bash
kubectl rollout undo deployment/ecommerce-backend -n production
kubectl rollout undo deployment/ecommerce-frontend -n production
```

### Rollback Manual (Blue-Green)
```bash
# Voltar tráfego para versão anterior
kubectl patch service ecommerce-backend \
  -p '{"spec":{"selector":{"version":"blue"}}}' \
  -n production
```

### Rollback de Database
```bash
# Executar migration reverter
kubectl run rollback-job \
  --image=ecommerce-pharmacy-backend:v1.1.9 \
  --entrypoint npm \
  --rm \
  -i \
  -- \
  run migration:revert \
  -n production
```

---

## Infraestrutura (IaC)

### Terraform

```hcl
# infra/terraform/main.tf

terraform {
  backend "s3" {
    bucket         = "ecommerce-pharmacy-tf-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-lock"
  }
}

provider "aws" {
  region = var.aws_region
}

# RDS PostgreSQL
resource "aws_db_instance" "pharmacy" {
  identifier           = "ecommerce-pharmacy-db"
  engine               = "postgres"
  engine_version       = "15.1"
  instance_class       = "db.r5.large"
  allocated_storage    = 100
  storage_type         = "gp3"
  storage_encrypted    = true
  multi_az             = true
  publicly_accessible  = false

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "pharmacy-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  tags = {
    Name        = "ecommerce-pharmacy-db"
    Environment = "production"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "pharmacy" {
  name = "ecommerce-pharmacy"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "ecommerce-pharmacy"
    Environment = "production"
  }
}

# Application Load Balancer
resource "aws_lb" "pharmacy" {
  name               = "ecommerce-pharmacy-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnets

  enable_deletion_protection = true
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  tags = {
    Name        = "ecommerce-pharmacy-alb"
    Environment = "production"
  }
}
```

### Deploy com Terraform

```bash
# Validar configuração
terraform plan -var-file=prod.tfvars

# Revisar mudanças
terraform plan -var-file=prod.tfvars -out=tfplan

# Aplicar
terraform apply tfplan
```

---

## Monitoramento

### Dashboards

#### DataDog
```
Dashboard URL: https://app.datadoghq.com/dashboard/{id}

Métricas principais:
- CPU/Memory utilization
- Request latency (p50, p95, p99)
- Error rate
- Database connections
- Payment transaction volume
- Document upload success rate
```

#### Prometheus + Grafana
```
Acesso: https://grafana.pharmacy.local

Dashboards:
- System Overview
- Application Metrics
- Database Performance
- API Endpoints
```

### Alertas

#### PagerDuty/Opsgenie
```
Alertas críticos:
- Error rate > 1% (page oncall)
- API response time > 1s p99
- Database CPU > 80% (page database team)
- Payment failures > 0.5%
- Document validation failures > 5%
```

### Logs

#### CloudWatch / ELK
```
Buscar problemas:
# Backend errors
logs @message:"ERROR" @service:"backend" | stats count by @log_stream

# Payment failures
logs @type:"payment" status:"FAILED" | stats count by reason

# Database slow queries
logs @duration > 1000 @type:"query" | stats count by query
```

---

## Troubleshooting

### Pod não inicia
```bash
# Verificar logs
kubectl logs pod-name -n production

# Descrever pod
kubectl describe pod pod-name -n production

# Verificar image
kubectl get pod pod-name -o jsonpath='{.spec.containers[0].image}'

# Tentar recriar
kubectl delete pod pod-name -n production
```

### API respondendo lentamente
```bash
# Verificar métricas
kubectl top pods -n production
kubectl top nodes

# Verificar conexões DB
kubectl port-forward svc/postgres 5432:5432
psql -h localhost -U admin -d ecommerce_pharmacy
SELECT count(*) FROM pg_stat_activity;

# Aumentar réplicas
kubectl scale deployment ecommerce-backend --replicas=5 -n production
```

### Erro de memória
```bash
# Ver uso atual
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].resources.limits.memory}{"\n"}{end}' -n production

# Aumentar limites
kubectl set resources deployment ecommerce-backend \
  --limits=memory=2Gi \
  -n production
```

---

## Checklist Pós-Deploy

- [ ] Verificar health endpoint
- [ ] Fazer login e navegar
- [ ] Criar um pedido de teste
- [ ] Verificar logs de erro
- [ ] Confirmar métricas normais
- [ ] Testar email de confirmação
- [ ] Verificar S3 uploads
- [ ] Testar API com Postman
- [ ] Executar smoke tests automatizados
- [ ] Notificar time sobre sucesso

---

**Última atualização**: 2026-06-25  
**Versão**: 1.0
