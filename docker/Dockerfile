FROM php:7-fpm-alpine
RUN apk upgrade --update && apk add libmcrypt-dev \
&& docker-php-ext-install mcrypt \
&& rm -rf /var/cache/apk/*

COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
CMD [ "php", "./generateTests.php" ]
