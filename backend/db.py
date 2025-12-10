

from flask_cors import CORS

from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'rohan'  
app.config['MYSQL_DB'] = 'student_insight'

mysql = MySQL(app)
