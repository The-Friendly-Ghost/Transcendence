
all: build start
	@cd backend && npx prisma db push || echo "\033[1;31mCould it be the container is not running?"

host:
	@bash SET_HOSTS

build:
	@bash SET_HOSTS
	@docker compose build || echo "\033[1;31mDid you start docker?"

start:
	docker compose up -d --remove-orphans

# prisma:
# reset prisma
# @cd backend && npx prisma generate && npx prisma db push --force-reset && npx prisma generate

stop:
	docker compose down

clean:
	docker compose down --remove-orphans
fclean:
	docker compose down --volumes --remove-orphans
	docker system prune -a -f
	docker system prune -a -f

exec-db:
	docker exec -it db sh

exec-backend:
	docker exec -it backend sh

exec-frontend:
	docker exec -it frontend sh

re: stop build start


.PHONY: all build start stop clean fclean re
