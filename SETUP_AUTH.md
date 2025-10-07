# Configuração de Autenticação com Supabase

## 1. Criar conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Crie um novo projeto

## 2. Obter as credenciais

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL** (URL do projeto)
   - **anon/public key** (Chave anônima/pública)

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

Substitua `sua_url_do_supabase` e `sua_chave_anonima` pelos valores que você copiou.

## 4. Configurar autenticação no Supabase

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Habilite **Email** como provider
3. Vá em **Authentication** > **Users**
4. Clique em **Add user** > **Create new user**
5. Crie um usuário com email e senha para testar

## 5. Testar a aplicação

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:3000`
3. Você será redirecionado para a página de login
4. Use as credenciais do usuário criado no passo 4
5. Após o login, você será redirecionado para o dashboard

## Estrutura implementada

- ✅ **Página de Login** (`/login`) - Interface de autenticação
- ✅ **Middleware** - Proteção de rotas autenticadas
- ✅ **Redirect automático** - Usuários não autenticados vão para login
- ✅ **Botão de Logout** - No header do dashboard
- ✅ **Cliente Supabase** - Configurado em `lib/supabase.ts`

## Páginas protegidas

- `/dashboard`
- `/flor-ne`
- `/real`

Todas essas páginas requerem autenticação para acesso.

