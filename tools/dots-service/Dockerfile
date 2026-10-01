FROM python:3.13-alpine
WORKDIR /app
COPY tools/dots-service/server.py /app/server.py
COPY dots/content/index.json /app/content.json
RUN addgroup -g 10001 dots && adduser -D -u 10001 -G dots dots && mkdir /data && chown dots:dots /data
USER dots
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/api/health', timeout=3)"
CMD ["python", "-u", "/app/server.py"]
