#!/bin/bash

# Script helper para gerenciar Docker do Dashboard de Estoque
# Uso: ./docker.sh [comando]

set -e

PROJECT_NAME="dash-estoque"
IMAGE_NAME="dash-estoque"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

function print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

function print_error() {
    echo -e "${RED}✗${NC} $1"
}

function check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Instale o Docker primeiro."
        exit 1
    fi
}

function build() {
    print_warning "Building Docker image..."
    docker build -t $IMAGE_NAME .
    print_success "Build concluído!"
}

function start() {
    print_warning "Iniciando container..."
    docker-compose up -d
    print_success "Container iniciado!"
    print_success "Acesse: http://localhost:3000"
}

function stop() {
    print_warning "Parando container..."
    docker-compose down
    print_success "Container parado!"
}

function restart() {
    print_warning "Reiniciando container..."
    docker-compose restart
    print_success "Container reiniciado!"
}

function logs() {
    print_warning "Mostrando logs (Ctrl+C para sair)..."
    docker-compose logs -f
}

function status() {
    print_warning "Status do container:"
    docker-compose ps
}

function clean() {
    print_warning "Removendo container e imagens..."
    docker-compose down -v
    docker rmi $IMAGE_NAME 2>/dev/null || true
    print_success "Limpeza concluída!"
}

function rebuild() {
    print_warning "Rebuilding e reiniciando..."
    docker-compose down
    docker-compose up -d --build
    print_success "Rebuild concluído!"
    print_success "Acesse: http://localhost:3000"
}

function shell() {
    print_warning "Abrindo shell no container..."
    docker exec -it $PROJECT_NAME sh
}

function help() {
    echo "Dashboard de Estoque - Docker Helper"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  build     - Build da imagem Docker"
    echo "  start     - Inicia o container"
    echo "  stop      - Para o container"
    echo "  restart   - Reinicia o container"
    echo "  rebuild   - Rebuild e restart"
    echo "  logs      - Mostra logs do container"
    echo "  status    - Mostra status do container"
    echo "  shell     - Abre shell no container"
    echo "  clean     - Remove container e imagens"
    echo "  help      - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./docker.sh build"
    echo "  ./docker.sh start"
    echo "  ./docker.sh logs"
}

# Main
check_docker

case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    rebuild)
        rebuild
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    shell)
        shell
        ;;
    clean)
        clean
        ;;
    help|--help|-h|"")
        help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        echo ""
        help
        exit 1
        ;;
esac

