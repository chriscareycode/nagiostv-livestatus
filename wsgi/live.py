#!/usr/bin/python
from cgi import parse_qs, escape
import json
def application(environ, start_response):

  parameters = parse_qs(environ.get('QUERY_STRING', ''))
  
  status = '200 OK'
  
  if 'command' in parameters:
    command = escape(parameters['command'][0])
  else:
    command = "GET hosts\nOutputFormat: json"

  socket_path = "/var/lib/nagios3/rw/live"
  import socket
  s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
  s.connect(socket_path)
  s.send(command+"\n")
  s.shutdown(socket.SHUT_WR)
  answer = s.recv(900000000)
  output = str(answer)
  
  response_headers = [('Content-type', 'application/json'),
                      ('Content-Length', str(len(output)))]
  start_response(status, response_headers)

  return [output]
