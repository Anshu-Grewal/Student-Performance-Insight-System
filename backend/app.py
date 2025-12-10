from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ================== DEMO DATA ==================
students = [
    {
        "id": 1,
        "name": "Rahul Sharma",
        "roll_no": 101,
        "class": "12A",
        "email": "rahul@gmail.com",
        "phone": "9876543210",
        "marks": 85,
        "attendance": 92,
        "grade": "A"
    },
    {
        "id": 2,
        "name": "Anjali Verma",
        "roll_no": 102,
        "class": "12A",
        "email": "anjali@gmail.com",
        "phone": "9876501234",
        "marks": 78,
        "attendance": 88,
        "grade": "B+"
    },
    {
        "id": 3,
        "name": "Aman Singh",
        "roll_no": 103,
        "class": "12B",
        "email": "aman@gmail.com",
        "phone": "9812345678",
        "marks": 90,
        "attendance": 95,
        "grade": "A+"
    }
]

@app.route("/")
def home():
    return jsonify({"message": "Student Insight Backend Running Successfully "})

@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)

@app.route("/students", methods=["POST"])
def add_student():
    data = request.json

    new_student = {
        "id": len(students) + 1,
        "roll_no": data["roll_no"],
        "name": data["name"],
        "class": data["class"],
        "email": data["email"],
        "phone": data["phone"],
        "marks": 0,
        "attendance": 0,
        "grade": "N/A"
    }

    students.append(new_student)
    return jsonify({"message": "Student added successfully "})

@app.route("/students/<int:roll_no>", methods=["PUT"])
def update_student(roll_no):
    data = request.json

    for s in students:
        if s["roll_no"] == roll_no:
            s["marks"] = data.get("marks", s["marks"])
            s["attendance"] = data.get("attendance", s["attendance"])
            s["grade"] = data.get("grade", s["grade"])
            return jsonify({"message": "Student updated successfully "})

    return jsonify({"error": "Student not found"}), 404

@app.route("/students/<int:roll_no>", methods=["DELETE"])
def delete_student(roll_no):
    global students
    students = [s for s in students if s["roll_no"] != roll_no]
    return jsonify({"message": "Student deleted successfully "})

@app.route("/attendance", methods=["POST"])
def save_attendance():
    return jsonify({"message": "Attendance saved successfully "})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
