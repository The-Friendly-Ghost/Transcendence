
all: build start

host:
	@bash SET_HOSTS

build:
	@bash SET_HOSTS
	@docker compose build || echo "\033[1;31mDid you start docker?"

start:
	docker compose up -d --remove-orphans

stop:
	docker compose down

clean:
	docker compose down --remove-orphans
fclean:
	docker compose down --volumes --remove-orphans

re: stop build start


.PHONY: all build start stop clean fclean re
