from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DB_FILE = 'tasks.json'

def load_db():
    if not os.path.exists(DB_FILE): return []
    try:
        with open(DB_FILE, 'r') as f: return json.load(f)
    except: return []

def save_db(tasks):
    with open(DB_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(load_db())

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    tasks = load_db()
    new_task = {
        "id": int(os.urandom(4).hex(), 16), # Unique number ID
        "title": data.get('title', 'New Task'),
        "description": data.get('description', ''),
        "status": data.get('status', 'Todo')
    }
    tasks.append(new_task)
    save_db(tasks)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    tasks = load_db()
    for task in tasks:
        if task['id'] == task_id:
            task.update(data)
            save_db(tasks)
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_db()
    # Create a new list without the deleted task
    new_tasks = [t for t in tasks if t['id'] != task_id]
    save_db(new_tasks)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    
    import uuid  # Add this at the top of your file

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    tasks = load_db()
    new_task = {
        "id": str(uuid.uuid4()), # Creates a unique string ID like 'a1b2-c3d4'
        "title": data.get('title', 'New Task'),
        "description": data.get('description', ''),
        "status": data.get('status', 'Todo')
    }
    tasks.append(new_task)
    save_db(tasks)
    return jsonify(new_task), 201

@app.route('/tasks/<string:task_id>', methods=['DELETE']) # Changed <int: to <string:
def delete_task(task_id):
    tasks = load_db()
    # Filter out the task by comparing strings
    new_tasks = [t for t in tasks if str(t['id']) != str(task_id)]
    
    if len(tasks) == len(new_tasks):
        return jsonify({"error": "Task not found"}), 404
        
    save_db(new_tasks)
    return '', 204