import sqlite3
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import urllib.parse
import os

DB_NAME = "survey_data.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS survey_responses
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  language TEXT,
                  age TEXT,
                  children TEXT,
                  preference TEXT,
                  intent INTEGER,
                  psm_too_cheap INTEGER,
                  psm_cheap INTEGER,
                  psm_expensive INTEGER,
                  psm_too_expensive INTEGER,
                  local_importance INTEGER,
                  premium_wtp TEXT,
                  franui_visual INTEGER,
                  franui_quality INTEGER,
                  franui_health INTEGER,
                  berrie_visual INTEGER,
                  berrie_quality INTEGER,
                  berrie_health INTEGER,
                  ip_address TEXT)''')
    conn.commit()
    conn.close()

class SurveyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        # Serve static files for frontend
        if self.path == '/':
            self.path = '/index.html'
            
        try:
            # Prevent directory traversal
            safe_path = os.path.basename(self.path)
            file_path = os.path.join(os.path.dirname(__file__), safe_path)
            
            with open(file_path, 'rb') as f:
                content = f.read()
                
            self.send_response(200)
            if self.path.endswith('.html'):
                self.send_header('Content-type', 'text/html; charset=utf-8')
            elif self.path.endswith('.css'):
                self.send_header('Content-type', 'text/css')
            elif self.path.endswith('.js'):
                self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')

    def do_POST(self):
        if self.path == '/submit':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Simple anti-spam/bot check: Honey pot field or minimum time could be added here
                # We'll log the IP for basic rate limiting analysis later if needed
                client_ip = self.client_address[0]
                
                # Validate PSM logic (cheap must be less than expensive)
                try:
                    tc = int(data.get('psm_too_cheap', 0))
                    c = int(data.get('psm_cheap', 0))
                    e = int(data.get('psm_expensive', 0))
                    te = int(data.get('psm_too_expensive', 0))
                    
                    if not (tc <= c <= e <= te):
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps({'error': 'PSM logic validation failed: prices must be ascending'}).encode())
                        return
                except ValueError:
                    pass # Ignore if they are not integers here, sqlite will handle or we enforce in frontend
                
                conn = sqlite3.connect(DB_NAME)
                c = conn.cursor()
                
                # Using parameterized query to prevent SQL injection
                c.execute('''INSERT INTO survey_responses 
                             (language, age, children, preference, intent, 
                              psm_too_cheap, psm_cheap, psm_expensive, psm_too_expensive,
                              local_importance, premium_wtp,
                              franui_visual, franui_quality, franui_health,
                              berrie_visual, berrie_quality, berrie_health, ip_address)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                          (data.get('lang', 'cs'),
                           data.get('age', ''),
                           data.get('children', ''),
                           data.get('preference', ''),
                           data.get('intent', 0),
                           data.get('psm_too_cheap', 0),
                           data.get('psm_cheap', 0),
                           data.get('psm_expensive', 0),
                           data.get('psm_too_expensive', 0),
                           data.get('local_importance', 0),
                           data.get('premium_wtp', ''),
                           data.get('franui_visual', 0),
                           data.get('franui_quality', 0),
                           data.get('franui_health', 0),
                           data.get('berrie_visual', 0),
                           data.get('berrie_quality', 0),
                           data.get('berrie_health', 0),
                           client_ip))
                
                conn.commit()
                conn.close()

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Data saved securely'}).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())

def run(server_class=ThreadingHTTPServer, handler_class=SurveyHandler, port=8000):
    init_db()
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting lightweight survey backend on port {port}...")
    print(f"SQLite Database initialized: {DB_NAME}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
