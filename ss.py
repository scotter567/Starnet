import socket
import sys
HOST = socket.gethostname()
PORT = 5000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    while True:
	    conn, addr = s.accept()
	    with conn:
	        print(f"Connected by {addr}")
	        data = conn.recv(1024)
	        if not data:
	        	continue
	        else:
	        	print(data)
