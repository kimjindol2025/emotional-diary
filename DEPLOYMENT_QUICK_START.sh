#!/bin/bash

# 감성 일기 (Emotional Intelligence Diary) 빠른 배포 스크립트
# 사용법: bash DEPLOYMENT_QUICK_START.sh [start|stop|restart|status|logs]

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# 색상
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Emotional Intelligence Diary - Deployment Script${NC}"
echo "================================================"
echo ""

# 함수: API 키 확인
check_api_key() {
    if grep -q "ANTHROPIC_API_KEY=sk-ant-placeholder" "$BACKEND_DIR/.env"; then
        echo -e "${YELLOW}⚠️  경고: Anthropic API 키가 설정되지 않았습니다!${NC}"
        echo "   1. backend/.env 파일을 열기"
        echo "   2. ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE로 설정"
        echo "   3. 저장"
        return 1
    fi
    return 0
}

# 함수: 의존성 설치
install_dependencies() {
    echo -e "${GREEN}[1/4] 의존성 설치 중...${NC}"
    
    echo "  백엔드 의존성..."
    cd "$BACKEND_DIR"
    npm install --silent || exit 1
    
    echo "  프론트엔드 의존성..."
    cd "$FRONTEND_DIR"
    npm install --silent || exit 1
    
    echo -e "${GREEN}✅ 의존성 설치 완료${NC}"
}

# 함수: PM2 시작
start_pm2() {
    echo -e "${GREEN}[2/4] PM2로 서비스 시작 중...${NC}"
    
    cd "$PROJECT_DIR"
    
    # PM2 설치 확인
    if ! command -v pm2 &> /dev/null; then
        echo "  PM2 설치 중..."
        npm install -g pm2 --silent
    fi
    
    # 기존 프로세스 중지
    pm2 delete emotional-diary 2>/dev/null || true
    
    # PM2 시작
    pm2 start ecosystem.config.js --name emotional-diary || exit 1
    pm2 save
    
    echo -e "${GREEN}✅ PM2 서비스 시작 완료${NC}"
}

# 함수: 상태 확인
check_status() {
    echo -e "${GREEN}[3/4] 서비스 상태 확인 중...${NC}"
    echo ""
    pm2 status
    echo ""
    echo -e "${GREEN}[4/4] 헬스 체크${NC}"
    sleep 2
    
    # 백엔드 헬스 체크
    if curl -s http://localhost:50050/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 백엔드: http://localhost:50050 (정상)${NC}"
    else
        echo -e "${RED}❌ 백엔드: http://localhost:50050 (응답 없음)${NC}"
    fi
    
    # 프론트엔드 헬스 체크 (Vite 개발 서버)
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 프론트엔드: http://localhost:5173 (정상)${NC}"
    else
        echo -e "${YELLOW}⚠️  프론트엔드: http://localhost:5173 (Vite 미실행)${NC}"
    fi
}

# 메인 로직
case "${1:-status}" in
    start)
        check_api_key || exit 1
        install_dependencies
        start_pm2
        check_status
        echo ""
        echo -e "${GREEN}🎉 배포 완료!${NC}"
        echo "   - 백엔드: http://localhost:50050"
        echo "   - 프론트엔드: http://localhost:5173"
        echo ""
        echo "로그 확인: pm2 logs emotional-diary-backend"
        ;;
    
    stop)
        echo -e "${YELLOW}서비스 중지 중...${NC}"
        pm2 stop emotional-diary
        echo -e "${GREEN}✅ 중지 완료${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}서비스 재시작 중...${NC}"
        pm2 restart emotional-diary
        sleep 2
        check_status
        ;;
    
    status)
        pm2 status
        echo ""
        check_status
        ;;
    
    logs)
        pm2 logs emotional-diary-backend
        ;;
    
    *)
        echo "사용법: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "옵션:"
        echo "  start   - 서비스 시작 (의존성 설치 + PM2 실행)"
        echo "  stop    - 서비스 중지"
        echo "  restart - 서비스 재시작"
        echo "  status  - 서비스 상태 확인"
        echo "  logs    - 실시간 로그 확인"
        exit 1
        ;;
esac
