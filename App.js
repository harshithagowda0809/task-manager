import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleSignup = () => {
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.text())
      .then(data => setResponse(data));
  };

  const handleLogin = () => {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user_id) {
          setUserId(data.user_id);
          setResponse(data.message);
          fetchTasks(data.user_id);
        } else {
          setResponse('Login failed');
        }
      });
  };

  const handleLogout = () => {
    setUserId(null);
    setTasks([]);
    setResponse('');
  };

  const addTask = () => {
    if (!task) return;

    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: task, user_id: userId })
    })
      .then(() => {
        setTask('');
        fetchTasks(userId);
      });
  };

  const fetchTasks = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchTasks(userId));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial'
    }}>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        width: '350px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>

        <h1 style={{ color: '#333' }}>✨ Task Manager</h1>

        {!userId && (
          <>
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />

            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />

            <button onClick={handleSignup} style={btnStyle('#4CAF50')}>
              Signup
            </button>

            <button onClick={handleLogin} style={btnStyle('#2196F3')}>
              Login
            </button>

            <p>{response}</p>
          </>
        )}

        {userId && (
          <>
            <button onClick={handleLogout} style={btnStyle('#f44336')}>
              Logout
            </button>

            <h3>Add Task</h3>

            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task..."
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />

            <button onClick={addTask} style={btnStyle('#9C27B0')}>
              Add Task
            </button>

            <h3>Your Tasks</h3>

            {tasks.map((t) => (
              <div key={t.id} style={{
                background: '#f1f1f1',
                margin: '8px 0',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {t.title}
                <button onClick={() => deleteTask(t.id)} style={btnStyle('#e91e63')}>
                  ❌
                </button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  background: color,
  color: 'white',
  border: 'none',
  padding: '10px',
  margin: '5px',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '100%'
});

export default App;