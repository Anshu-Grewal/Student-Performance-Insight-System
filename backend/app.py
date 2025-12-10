from flask_cors import CORS
from db import app, mysql
from flask import Flask, request, jsonify
import sqlite3

CORS(app)

from flask import jsonify

@app.route("/")
def home():
    return jsonify({"message": "Student Insight Backend Running Successfully ✅"})


@app.route("/students", methods=["GET"])
def get_students():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM students")
    data = cur.fetchall()
    cur.close()
    students = []
    for row in data:
        students.append({
            "id": row[0],
            "name": row[1],
            "roll_no": row[2],
            "class": row[3],
            "email": row[4],
            "phone": row[5],
            "marks": row[6],
            "attendance": row[7],
            "grade": row[8]
        })
    return jsonify(students)

@app.route('/add-student', methods=['POST'])
def add_student():
    data = request.json
    roll_no = data['roll_no']
    name = data['name']
    class_name = data['class']
    email = data['email']
    phone = data['phone']
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO students (roll_no, name, class, email, phone)
        VALUES (%s, %s, %s, %s, %s)
    """, (roll_no, name, class_name, email, phone))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Student added successfully!"})

@app.route("/update-marks", methods=["POST"])
def update_marks():
    data = request.json
    roll_no = data["roll_no"]
    marks = data["marks"]
    attendance = data["attendance"]
    grade = data["grade"]
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE students SET marks=%s, attendance=%s, grade=%s WHERE roll_no=%s
    """, (marks, attendance, grade, roll_no))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Student updated successfully"})



@app.route("/update-profile", methods=["POST"])
def update_profile():
    data = request.json

    roll_no = data["roll_no"]
    name = data["name"]
    class_name = data["class"]
    email = data["email"]
    phone = data["phone"]
    marks = data["marks"]
    attendance = data["attendance"]
    grade = data["grade"]

    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE students
        SET name=%s,
            class=%s,
            email=%s,
            phone=%s,
            marks=%s,
            attendance=%s,
            grade=%s
        WHERE roll_no=%s
    """, (name, class_name, email, phone, marks, attendance, grade, roll_no))

    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Profile updated successfully ✅"})




@app.route("/delete-student/<int:roll_no>", methods=["DELETE"])
def delete_student(roll_no):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM students WHERE roll_no=%s", (roll_no,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Student deleted successfully"})

@app.route('/mark_attendance', methods=['POST', 'OPTIONS'])
def mark_attendance():

    # ✅ Preflight (OPTIONS) request ko sahi response
    if request.method == 'OPTIONS':
        return '', 200

    # ✅ Safe JSON read
    data = request.get_json(force=True)

    date = data.get('date')
    students = data.get('students')

    cur = mysql.connection.cursor()

    for s in students:
        cur.execute("""
            INSERT INTO attendance (student_id, date, status)
            VALUES (%s, %s, %s)
        """, (s['student_id'], date, s['status']))

    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Attendance Saved Successfully ✅"})

if __name__ == "__main__":
    app.run(debug=True)