"""

To run:
    python server.py

To post:
    post to localhost:3001/ with JSON body containing

    {
        "msg": "Enter your message here."
    }

    The value of "msg" gets printed to console

"""


from BaseHTTPServer import BaseHTTPRequestHandler
import urlparse, json

class GetHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_len = int(self.headers.getheader('content-length'))
        post_body = self.rfile.read(content_len)
        self.send_response(200)
        self.end_headers()

        data = json.loads(post_body)

        print data['msg']

        self.wfile.write({ 'status': 'OK' })
        return

if __name__ == '__main__':
    from BaseHTTPServer import HTTPServer
    server = HTTPServer(('localhost', 3001), GetHandler)
    print 'Starting server at http://localhost:3001'
    server.serve_forever()
