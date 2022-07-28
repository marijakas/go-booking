# syntax=docker/dockerfile:1
FROM python:3.6-alpine
WORKDIR /code
ENV FLASK_APP=manage.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install psycopg2-binary
EXPOSE 8080
COPY . .
CMD ["flask", "run"]