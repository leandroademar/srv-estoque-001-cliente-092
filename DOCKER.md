# 🐳 Guia Docker - Dashboard de Estoque

Este guia explica como usar Docker para containerizar e executar o Dashboard de Estoque.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)

## 🚀 Uso Rápido

### Opção 1: Docker Compose (Recomendado)

```bash
# 1. Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 2. Build e execute
docker-compose up -d

# 3. Acesse a aplicação
# http://localhost:3000
```

### Opção 2: Docker direto

```bash
# 1. Build da imagem
docker build -t dash-estoque .

# 2. Execute o container
docker run -d \
  --name dash-estoque \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=sua_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave \
  dash-estoque

# 3. Acesse a aplicação
# http://localhost:3000
```

## 🔧 Comandos Úteis

### Gerenciamento do Container

```bash
# Ver logs
docker-compose logs -f

# Parar o container
docker-compose down

# Reiniciar o container
docker-compose restart

# Rebuild e restart
docker-compose up -d --build
```

### Comandos Docker diretos

```bash
# Ver logs
docker logs -f dash-estoque

# Parar o container
docker stop dash-estoque

# Remover o container
docker rm dash-estoque

# Listar containers em execução
docker ps

# Ver status do container
docker inspect dash-estoque
```

## 📦 Estrutura do Dockerfile

O Dockerfile usa **multi-stage build** para otimizar o tamanho final da imagem:

1. **Stage 1 (deps)**: Instala apenas as dependências de produção
2. **Stage 2 (builder)**: Faz o build da aplicação Next.js
3. **Stage 3 (runner)**: Cria a imagem final otimizada para produção

### Benefícios:
- ✅ Imagem final menor (~200MB)
- ✅ Melhor segurança (usuário não-root)
- ✅ Build otimizado e em cache
- ✅ Apenas arquivos necessários na imagem final

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🌐 Portas

- **3000**: Porta da aplicação Next.js (mapeada para host)

## 📊 Health Check

O container inclui um health check que verifica se a aplicação está respondendo:
- Intervalo: 30 segundos
- Timeout: 10 segundos
- Retries: 3 tentativas
- Start period: 40 segundos

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# 1. Pare o container
docker-compose down

# 2. Atualize o código
git pull

# 3. Rebuild e restart
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to Docker daemon"
```bash
# Verifique se o Docker está rodando
docker ps

# Inicie o Docker
sudo systemctl start docker
```

### Erro: "Port 3000 already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000

# Mate o processo ou use outra porta no docker-compose.yml
ports:
  - "3001:3000"
```

### Erro: "Permission denied"
```bash
# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Faça logout e login novamente
```

### Container não inicia
```bash
# Verifique os logs
docker-compose logs

# Verifique as variáveis de ambiente
docker exec dash-estoque env
```

## 🚀 Deploy em Produção

### Usando Docker Hub

```bash
# 1. Build com tag
docker build -t seu-usuario/dash-estoque:latest .

# 2. Push para Docker Hub
docker push seu-usuario/dash-estoque:latest

# 3. Pull no servidor de produção
docker pull seu-usuario/dash-estoque:latest

# 4. Execute
docker run -d \
  --name dash-estoque \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  seu-usuario/dash-estoque:latest
```

### Usando Registry Privado

```bash
# 1. Tag com registry privado
docker tag dash-estoque registry.exemplo.com/dash-estoque:latest

# 2. Push
docker push registry.exemplo.com/dash-estoque:latest
```

## 📝 Notas Importantes

1. **Dados sensíveis**: Nunca commite o arquivo `.env.local`
2. **Build time**: O primeiro build pode levar alguns minutos
3. **Cache**: Docker usa cache para acelerar builds subsequentes
4. **Logs**: Use `docker logs` para debug
5. **Recursos**: O container usa recursos mínimos (~256MB RAM)

## 🔗 Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

