from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['MYSQL_HOST'] = 'trolley.proxy.rlwy.net'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ovieesOFikLvKqkKEQNSLQDMEjGXehJh'
app.config['MYSQL_DB'] = 'railway'
app.config['MYSQL_PORT'] = 27474

mysql = MySQL(app)
