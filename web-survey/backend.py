import sqlite3
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import os
from urllib.parse import urlsplit

DB_NAME = os.getenv("SURVEY_DB_PATH", os.path.join(os.path.dirname(__file__), "survey_data.db"))


def ensure_column(cursor, table_name, column_name, column_type):
    cursor.execute(f"PRAGMA table_info({table_name})")
    existing_columns = {row[1] for row in cursor.fetchall()}
    if column_name not in existing_columns:
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")


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
                  purchase_frequency TEXT,
                  main_barrier TEXT,
                  session_id TEXT,
                  utm_source TEXT,
                  utm_medium TEXT,
                  utm_campaign TEXT,
                  ip_address TEXT)''')

    c.execute('''CREATE TABLE IF NOT EXISTS survey_events
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  session_id TEXT,
                  event_type TEXT,
                  step TEXT,
                  duration_ms INTEGER,
                  language TEXT,
                  utm_source TEXT,
                  utm_medium TEXT,
                  utm_campaign TEXT,
                  ip_address TEXT)''')

    ensure_column(c, 'survey_responses', 'purchase_frequency', 'TEXT')
    ensure_column(c, 'survey_responses', 'main_barrier', 'TEXT')
    ensure_column(c, 'survey_responses', 'session_id', 'TEXT')
    ensure_column(c, 'survey_responses', 'utm_source', 'TEXT')
    ensure_column(c, 'survey_responses', 'utm_medium', 'TEXT')
    ensure_column(c, 'survey_responses', 'utm_campaign', 'TEXT')

    conn.commit()
    conn.close()


def fetch_metrics_summary():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("SELECT COUNT(DISTINCT session_id) AS opens FROM survey_events WHERE event_type = 'survey_open'")
    opens = c.fetchone()['opens'] or 0

    c.execute("SELECT COUNT(*) AS submits FROM survey_responses")
    submits = c.fetchone()['submits'] or 0

    completion_rate = round((submits / opens) * 100, 2) if opens else 0

    c.execute("""
        SELECT step, COUNT(*) AS views
        FROM survey_events
        WHERE event_type = 'step_view' AND step IS NOT NULL
        GROUP BY step
        ORDER BY CAST(step AS INTEGER)
    """)
    step_views_rows = c.fetchall()
    step_views = {row['step']: row['views'] for row in step_views_rows}

    ordered_steps = ['0', '1', '2', '3', '4']
    dropoff = []
    for index, step in enumerate(ordered_steps):
        current_views = step_views.get(step, 0)
        next_views = submits if index == len(ordered_steps) - 1 else step_views.get(ordered_steps[index + 1], 0)
        dropoff.append({
            'step': step,
            'views': current_views,
            'next': next_views,
            'dropoff_count': max(current_views - next_views, 0),
            'dropoff_rate_pct': round((max(current_views - next_views, 0) / current_views) * 100, 2) if current_views else 0
        })

    c.execute("""
        SELECT language, COUNT(*) AS count
        FROM survey_responses
        GROUP BY language
        ORDER BY count DESC
    """)
    language_distribution = [dict(row) for row in c.fetchall()]

    c.execute("""
        SELECT COALESCE(NULLIF(utm_source, ''), '(direct)') AS source, COUNT(*) AS count
        FROM survey_responses
        GROUP BY source
        ORDER BY count DESC
    """)
    source_distribution = [dict(row) for row in c.fetchall()]

    c.execute("""
        SELECT AVG(duration_ms) AS avg_duration_ms
        FROM survey_events
        WHERE event_type = 'step_time' AND duration_ms IS NOT NULL AND duration_ms > 0
    """)
    avg_step_time_ms = c.fetchone()['avg_duration_ms']

    c.execute("""
        SELECT COUNT(*) AS flat_score_responses
        FROM survey_responses
        WHERE franui_visual = franui_quality
          AND franui_quality = franui_health
          AND franui_health = berrie_visual
          AND berrie_visual = berrie_quality
          AND berrie_quality = berrie_health
    """)
    flat_score_responses = c.fetchone()['flat_score_responses'] or 0

    conn.close()

    return {
        'overview': {
            'opens': opens,
            'submits': submits,
            'completion_rate_pct': completion_rate,
            'avg_step_time_ms': round(avg_step_time_ms, 2) if avg_step_time_ms else 0
        },
        'step_dropoff': dropoff,
        'language_distribution': language_distribution,
        'source_distribution': source_distribution,
        'quality': {
            'flat_score_responses': flat_score_responses
        }
    }

class SurveyHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def _read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        return json.loads(raw_body.decode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        path = urlsplit(self.path).path

        if path == '/_ops/metrics':
            try:
                summary = fetch_metrics_summary()
                self._send_json(200, {'status': 'success', 'data': summary})
            except Exception as err:
                self._send_json(500, {'status': 'error', 'message': str(err)})
            return

        if path == '/_ops/dashboard':
            self.path = '/dashboard.html'

        # Serve static files for frontend
        if path == '/':
            self.path = '/index.html'
            
        try:
            # Prevent directory traversal but allow subdirectories
            safe_path = os.path.normpath(self.path).lstrip('/')
            if '..' in safe_path or safe_path.startswith('/'):
                self.send_response(403)
                self.end_headers()
                return

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
            elif self.path.endswith('.png'):
                self.send_header('Content-type', 'image/png')
            elif self.path.endswith('.jpg') or self.path.endswith('.jpeg'):
                self.send_header('Content-type', 'image/jpeg')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')

    def do_POST(self):
        path = urlsplit(self.path).path

        if path == '/track':
            try:
                data = self._read_json_body()
                client_ip = self.client_address[0]

                conn = sqlite3.connect(DB_NAME)
                c = conn.cursor()
                c.execute('''INSERT INTO survey_events
                             (session_id, event_type, step, duration_ms, language,
                              utm_source, utm_medium, utm_campaign, ip_address)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                          (data.get('session_id', ''),
                           data.get('event_type', ''),
                           str(data.get('step', '')),
                           data.get('duration_ms', None),
                           data.get('lang', 'cs'),
                           data.get('utm_source', ''),
                           data.get('utm_medium', ''),
                           data.get('utm_campaign', ''),
                           client_ip))
                conn.commit()
                conn.close()

                self._send_json(200, {'status': 'success'})
            except Exception as err:
                self._send_json(500, {'status': 'error', 'message': str(err)})
            return

        if path == '/submit':
            
            try:
                data = self._read_json_body()
                
                # Simple anti-spam/bot check: Honey pot field or minimum time could be added here
                # We'll log the IP for basic rate limiting analysis later if needed
                client_ip = self.client_address[0]
                
                # PSM logic validation removed to allow any user input during testing
                
                conn = sqlite3.connect(DB_NAME)
                c = conn.cursor()
                
                # Using parameterized query to prevent SQL injection
                c.execute('''INSERT INTO survey_responses 
                             (language, age, children, preference, intent, 
                              psm_too_cheap, psm_cheap, psm_expensive, psm_too_expensive,
                              local_importance, premium_wtp,
                              franui_visual, franui_quality, franui_health,
                                                            berrie_visual, berrie_quality, berrie_health,
                                                            purchase_frequency, main_barrier,
                                                            session_id, utm_source, utm_medium, utm_campaign,
                                                            ip_address)
                                                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
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
                           data.get('purchase_frequency', ''),
                           data.get('main_barrier', ''),
                           data.get('session_id', ''),
                           data.get('utm_source', ''),
                           data.get('utm_medium', ''),
                           data.get('utm_campaign', ''),
                           client_ip))
                
                conn.commit()
                conn.close()

                self._send_json(200, {'status': 'success', 'message': 'Data saved securely'})
                
            except Exception as e:
                self._send_json(500, {'status': 'error', 'message': str(e)})

def run(server_class=ThreadingHTTPServer, handler_class=SurveyHandler, port=8000):
    init_db()
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting lightweight survey backend on port {port}...")
    print(f"SQLite Database initialized: {DB_NAME}")
    httpd.serve_forever()

if __name__ == '__main__':
    configured_port = int(os.getenv("SURVEY_PORT", os.getenv("PORT", "8000")))
    run(port=configured_port)
